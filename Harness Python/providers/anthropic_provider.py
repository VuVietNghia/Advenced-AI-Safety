import asyncio
from anthropic import AsyncAnthropic
from providers.base import BaseProvider
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

class AnthropicProvider(BaseProvider):
    def __init__(self, api_key: str, base_url: str, model: str, timeout: int = 30):
        self.api_key = api_key
        self.base_url = base_url
        self.model = model
        self.name = "anthropic"
        self.timeout = timeout
        
        headers = {}
        if "roxane.one" in base_url:
            headers["Authorization"] = f"Bearer {api_key}"
            
        self.client = AsyncAnthropic(api_key=api_key, base_url=base_url, timeout=timeout, default_headers=headers)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True
    )
    async def complete(self, messages: list[dict], **kwargs) -> str:
        resp = await self.client.messages.create(
            model=self.model,
            max_tokens=kwargs.get("max_tokens", 1024),
            messages=messages
        )
        if not resp.content:
            if hasattr(resp, "choices") and getattr(resp, "choices"):
                return getattr(resp, "choices")[0]["message"]["content"]
            elif hasattr(resp, "model_extra") and resp.model_extra and "choices" in resp.model_extra:
                return resp.model_extra["choices"][0]["message"]["content"]
            return str(resp)
        return resp.content[0].text

    async def health_check(self) -> bool:
        try:
            # Gửi một message đơn giản để check API key và base_url
            await self.complete([{"role": "user", "content": "Hi"}], max_tokens=5)
            return True
        except Exception as e:
            print(f"[{self.name}] Health check failed: {e}")
            return False
