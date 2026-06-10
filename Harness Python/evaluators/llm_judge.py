import json
import asyncio
from evaluators.base import BaseEvaluator, EvalResult
from providers import REGISTRY

class LLMJudgeEvaluator(BaseEvaluator):
    # LLM Judge returns an EvalResult but complete() is async, so evaluate needs to be synchronous for compatibility or we run it in event loop?
    # Oh wait, evaluate() in base is synchronous. But provider.complete() is async.
    # We should make BaseEvaluator.evaluate async. Let's fix that!
    
    async def evaluate(self, output: str, test_case: dict) -> EvalResult:
        criteria = test_case.get("criteria", "Rate the answer from 1 to 5.")
        question = test_case.get("input", "")
        
        prompt = f"""You are an expert evaluator. Given a question and an answer, rate the answer.
Question: {question}
Answer: {output}
Criteria: {criteria}

Respond ONLY with JSON: {{"score": <1-5>, "reason": "<short reason>"}}"""

        judge = REGISTRY.get("claude_judge")
        if not judge:
            return EvalResult(passed=False, score=0.0, reason="Judge provider 'claude_judge' not found.")
            
        try:
            judge_output = await judge.complete([{"role": "user", "content": prompt}], max_tokens=150)
            
            clean_output = judge_output.strip()
            if clean_output.startswith("```json"): clean_output = clean_output[7:]
            elif clean_output.startswith("```"): clean_output = clean_output[3:]
            if clean_output.endswith("```"): clean_output = clean_output[:-3]
            clean_output = clean_output.strip()
            
            parsed = json.loads(clean_output)
            score = float(parsed.get("score", 0))
            reason = parsed.get("reason", "")
            
            normalized_score = min(max(score / 5.0, 0.0), 1.0)
            passed = normalized_score >= 0.6
            
            return EvalResult(passed=passed, score=normalized_score, reason=reason)
        except Exception as e:
            return EvalResult(passed=False, score=0.0, reason=f"LLM Judge error: {e}")

