from evaluators.base import BaseEvaluator, EvalResult

class ExactMatchEvaluator(BaseEvaluator):
    async def evaluate(self, output: str, test_case: dict) -> EvalResult:
        expected = test_case.get("expected", "").strip().lower()
        actual = output.strip().lower()
        
        if actual == expected:
            return EvalResult(passed=True, score=1.0)
        return EvalResult(passed=False, score=0.0, reason=f"Expected '{expected}', got '{actual}'")
