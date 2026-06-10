from abc import ABC, abstractmethod

class BaseProvider(ABC):
    name: str = "base"

    @abstractmethod
    async def complete(self, messages: list[dict], **kwargs) -> str:
        """Gửi messages, trả về string response."""
        pass

    @abstractmethod
    async def health_check(self) -> bool:
        """Kiểm tra provider có hoạt động không."""
        pass
