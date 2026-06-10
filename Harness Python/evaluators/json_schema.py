import json
import jsonschema
from evaluators.base import BaseEvaluator, EvalResult

class JsonSchemaEvaluator(BaseEvaluator):
    async def evaluate(self, output: str, test_case: dict) -> EvalResult:
        schema = test_case.get("schema", {})
        if not schema:
            return EvalResult(passed=False, score=0.0, reason="No schema provided")
            
        # Strip markdown fences if any
        clean_output = output.strip()
        if clean_output.startswith("```json"):
            clean_output = clean_output[7:]
        elif clean_output.startswith("```"):
            clean_output = clean_output[3:]
        if clean_output.endswith("```"):
            clean_output = clean_output[:-3]
            
        clean_output = clean_output.strip()
        
        try:
            parsed = json.loads(clean_output)
            jsonschema.validate(instance=parsed, schema=schema)
            return EvalResult(passed=True, score=1.0)
        except json.JSONDecodeError as e:
            return EvalResult(passed=False, score=0.0, reason=f"Invalid JSON: {e}")
        except jsonschema.ValidationError as e:
            return EvalResult(passed=False, score=0.0, reason=f"Schema validation failed: {e.message}")
