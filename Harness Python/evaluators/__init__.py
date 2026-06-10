from evaluators.base import BaseEvaluator
from evaluators.exact_match import ExactMatchEvaluator
from evaluators.contains import ContainsEvaluator
from evaluators.json_schema import JsonSchemaEvaluator
from evaluators.llm_judge import LLMJudgeEvaluator

EVALUATOR_MAP = {
    "exact_match": ExactMatchEvaluator,
    "contains": ContainsEvaluator,
    "json_schema": JsonSchemaEvaluator,
    "llm_judge": LLMJudgeEvaluator,
}

def get_evaluator(eval_type: str) -> BaseEvaluator:
    return EVALUATOR_MAP[eval_type]()
