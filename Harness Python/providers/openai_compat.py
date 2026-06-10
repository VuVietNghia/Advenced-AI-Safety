import asyncio
from openai import AsyncOpenAI
from providers.base import BaseProvider
from tenacity import retry, stop_after_attempt, wait_exponential

class OpenAICompatProvider(BaseProvider):
    def __init__(self, base_url: str, api_key: str, model: str, provider_name: str, timeout: int = 30):
        self.base_url = base_url
        self.api_key = api_key
        self.model = model
        self.name = provider_name
        self.timeout = timeout
        self.client = AsyncOpenAI(api_key=api_key, base_url=base_url, timeout=timeout)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True
    )
    async def complete(self, messages: list[dict], **kwargs) -> str:
        resp = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_tokens=kwargs.get("max_tokens", 1024)
        )
        return resp.choices[0].message.content

    async def health_check(self) -> bool:
        try:
            await self.complete([{"role": "user", "content": "Hi"}], max_tokens=5)
            return True
        except Exception as e:
            print(f"[{self.name}] Health check failed: {e}")
            return False
