import pytest
import json
from pathlib import Path
from harness.runner import run_suite
from harness.baseline import load_baseline, compare_with_baseline

REGRESSION_THRESHOLD = 0.05  # avg_score không được giảm quá 5%

@pytest.mark.asyncio
async def test_no_regression_claude():
    dataset_path = Path("datasets/math_basic.jsonl")
    if not dataset_path.exists():
        pytest.skip("Dataset math_basic.jsonl not found")
        
    with open(dataset_path, "r", encoding="utf-8") as f:
        cases = [json.loads(l) for l in f]

    # Cần kiểm tra xem có baseline không trước khi chạy để tiết kiệm API nếu không có
    baseline = load_baseline("claude_math")
    if baseline is None:
        pytest.skip("No baseline found — run main.py --save-baseline first")

    results = await run_suite(cases, providers=["claude"], concurrency=2)
    
    comparison = compare_with_baseline(
        [r.__dict__ for r in results], baseline
    )
    
    assert comparison["score_delta"] >= -REGRESSION_THRESHOLD, (
        f"Regression detected! Score dropped by {-comparison['score_delta']:.2%}"
    )
