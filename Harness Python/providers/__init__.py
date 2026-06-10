from config import get_env
from providers.anthropic_provider import AnthropicProvider
from providers.openai_compat import OpenAICompatProvider

REGISTRY: dict = {
    "claude": AnthropicProvider(
        api_key=get_env("ANTHROPIC_AUTH_TOKEN", "user-1779871750268-key"),
        base_url=get_env("ANTHROPIC_BASE_URL", "https://llm-hub.roxane.one"),
        model=get_env("ANTHROPIC_DEFAULT_HAIKU_MODEL", "glm-4.5"),
    ),
    "claude_judge": AnthropicProvider(
        api_key=get_env("ANTHROPIC_AUTH_TOKEN", "user-1779871750268-key"),
        base_url=get_env("ANTHROPIC_BASE_URL", "https://llm-hub.roxane.one"),
        model=get_env("ANTHROPIC_DEFAULT_SONNET_MODEL", "glm-4.6"),
    ),
    "lm_studio": OpenAICompatProvider(
        base_url=get_env("LM_STUDIO_BASE_URL", "http://localhost:1234/v1"),
        api_key="lm-studio",
        model=get_env("LM_STUDIO_MODEL", "local-model"),
        provider_name="lm_studio",
    ),
    "openrouter": OpenAICompatProvider(
        base_url="https://openrouter.ai/api/v1",
        api_key=get_env("OPENROUTER_API_KEY", "not_provided") if get_env("OPENROUTER_API_KEY") else "not_provided",
        model="mistralai/mistral-7b-instruct",
        provider_name="openrouter",
    ),
    "groq": OpenAICompatProvider(
        base_url="https://api.groq.com/openai/v1",
        api_key=get_env("GROQ_API_KEY", "not_provided") if get_env("GROQ_API_KEY") else "not_provided",
        model="llama-3.1-8b-instant",
        provider_name="groq",
    ),
}
