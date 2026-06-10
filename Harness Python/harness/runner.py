import asyncio
import time
from dataclasses import dataclass
from providers import REGISTRY
from evaluators import get_evaluator

@dataclass
class TestResult:
    test_id: str
    provider: str
    input: str
    output: str
    passed: bool
    score: float
    reason: str
    latency_ms: float
    error: str = ""

async def run_single(provider_name: str, test_case: dict) -> TestResult:
    provider = REGISTRY.get(provider_name)
    if not provider:
        return TestResult(
            test_id=test_case.get("id", "unknown"),
            provider=provider_name,
            input=test_case.get("input", ""),
            output="",
            passed=False,
            score=0.0,
            reason="Provider not found",
            latency_ms=0.0,
            error="Provider not found in registry"
        )
        
    start = time.monotonic()
    try:
        output = await provider.complete([{"role": "user", "content": test_case["input"]}])
        latency = (time.monotonic() - start) * 1000
        
        evaluator = get_evaluator(test_case["eval_type"])
        result = await evaluator.evaluate(output, test_case)
        
        return TestResult(
            test_id=test_case.get("id", "unknown"),
            provider=provider_name,
            input=test_case.get("input", ""),
            output=output,
            passed=result.passed,
            score=result.score,
            reason=result.reason,
            latency_ms=round(latency, 1),
        )
    except Exception as e:
        latency = (time.monotonic() - start) * 1000
        return TestResult(
            test_id=test_case.get("id", "unknown"),
            provider=provider_name,
            input=test_case.get("input", ""),
            output="",
            passed=False,
            score=0.0,
            reason="",
            latency_ms=round(latency, 1),
            error=str(e),
        )

async def run_suite(
    test_cases: list[dict],
    providers: list[str],
    concurrency: int = 5
) -> list[TestResult]:
    semaphore = asyncio.Semaphore(concurrency)

    async def bounded(p, tc):
        async with semaphore:
            return await run_single(p, tc)

    tasks = [bounded(p, tc) for p in providers for tc in test_cases]
    return await asyncio.gather(*tasks)
