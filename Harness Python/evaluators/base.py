from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class EvalResult:
    passed: bool
    score: float          # 0.0 -> 1.0
    reason: str = ""

class BaseEvaluator(ABC):
    @abstractmethod
    async def evaluate(self, output: str, test_case: dict) -> EvalResult:
        pass
