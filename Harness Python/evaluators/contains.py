from evaluators.base import BaseEvaluator, EvalResult

class ContainsEvaluator(BaseEvaluator):
    async def evaluate(self, output: str, test_case: dict) -> EvalResult:
        keywords = test_case.get("expected_contains", [])
        if not keywords:
            return EvalResult(passed=True, score=1.0)
            
        output_lower = output.lower()
        matched = sum(1 for k in keywords if str(k).lower() in output_lower)
        score = matched / len(keywords)
        
        if score == 1.0:
            return EvalResult(passed=True, score=1.0)
            
        missing = [k for k in keywords if str(k).lower() not in output_lower]
        return EvalResult(passed=False, score=score, reason=f"Missing keywords: {missing}")
