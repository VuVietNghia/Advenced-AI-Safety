import json
import os
import csv
from datetime import datetime
from pathlib import Path
from tabulate import tabulate
from harness.runner import TestResult

RESULTS_DIR = Path("results")

def print_table(results: list[TestResult]):
    headers = ["Provider", "Test ID", "Pass", "Score", "Latency", "Reason", "Error"]
    table = []
    
    provider_stats = {}
    
    for r in results:
        table.append([
            r.provider,
            r.test_id,
            "✅" if r.passed else "❌",
            f"{r.score:.2f}",
            f"{r.latency_ms:.0f}ms",
            r.reason[:50] + "..." if len(r.reason) > 50 else r.reason,
            r.error[:30] + "..." if len(r.error) > 30 else r.error
        ])
        
        if r.provider not in provider_stats:
            provider_stats[r.provider] = {"total": 0, "passed": 0, "score_sum": 0.0, "latency_sum": 0.0}
            
        st = provider_stats[r.provider]
        st["total"] += 1
        if r.passed: st["passed"] += 1
        st["score_sum"] += r.score
        st["latency_sum"] += r.latency_ms

    print("\n" + tabulate(table, headers=headers, tablefmt="grid") + "\n")
    
    print("--- Summary ---")
    sum_headers = ["Provider", "Pass Rate", "Avg Score", "Avg Latency"]
    sum_table = []
    for p, st in provider_stats.items():
        pass_rate = st["passed"] / st["total"] if st["total"] > 0 else 0
        avg_score = st["score_sum"] / st["total"] if st["total"] > 0 else 0
        avg_latency = st["latency_sum"] / st["total"] if st["total"] > 0 else 0
        sum_table.append([
            p,
            f"{pass_rate:.1%}",
            f"{avg_score:.2f}",
            f"{avg_latency:.0f}ms"
        ])
        
    print(tabulate(sum_table, headers=sum_headers, tablefmt="simple") + "\n")


def export_results(results: list[TestResult], run_id: str = None):
    RESULTS_DIR.mkdir(exist_ok=True)
    if not run_id:
        run_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        
    json_path = RESULTS_DIR / f"run_{run_id}.json"
    csv_path = RESULTS_DIR / f"run_{run_id}.csv"
    
    data = [r.__dict__ for r in results]
    
    # Export JSON
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Results saved to JSON: {json_path}")
    
    # Export CSV
    if data:
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)
        print(f"Results saved to CSV: {csv_path}")
