import json
from pathlib import Path

BASELINE_DIR = Path("baselines")

def save_baseline(results: list[dict], name: str):
    BASELINE_DIR.mkdir(exist_ok=True)
    path = BASELINE_DIR / f"{name}.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"Baseline saved: {path}")

def load_baseline(name: str) -> list[dict] | None:
    path = BASELINE_DIR / f"{name}.json"
    if not path.exists():
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def compare_with_baseline(current: list[dict], baseline: list[dict]) -> dict:
    # Build maps for easy comparison by test_id + provider
    base_map = {f"{b['provider']}_{b['test_id']}": b for b in baseline}
    curr_map = {f"{c['provider']}_{c['test_id']}": c for c in current}
    
    regressions = []
    improvements = []
    
    base_score_sum = 0.0
    curr_score_sum = 0.0
    valid_comparisons = 0
    
    for key, c in curr_map.items():
        if key in base_map:
            b = base_map[key]
            base_score_sum += b["score"]
            curr_score_sum += c["score"]
            valid_comparisons += 1
            
            if b["passed"] and not c["passed"]:
                regressions.append({"test_id": c["test_id"], "provider": c["provider"], "old_score": b["score"], "new_score": c["score"]})
            elif not b["passed"] and c["passed"]:
                improvements.append({"test_id": c["test_id"], "provider": c["provider"], "old_score": b["score"], "new_score": c["score"]})
                
    avg_base = base_score_sum / valid_comparisons if valid_comparisons > 0 else 0
    avg_curr = curr_score_sum / valid_comparisons if valid_comparisons > 0 else 0
    
    return {
        "regressions": regressions,
        "improvements": improvements,
        "score_delta": avg_curr - avg_base,
        "comparisons": valid_comparisons
    }
