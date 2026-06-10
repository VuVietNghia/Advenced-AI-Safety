import argparse
import asyncio
import json
import sys
from pathlib import Path

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

from providers import REGISTRY
from harness.runner import run_suite
from harness.reporter import print_table, export_results
from harness.baseline import save_baseline, load_baseline, compare_with_baseline

async def main():
    parser = argparse.ArgumentParser(description="LLM Test Harness")
    parser.add_argument("command", choices=["run", "compare", "health"], help="Command to run")
    parser.add_argument("--providers", nargs="+", help="List of providers to run (e.g. claude lm_studio), or 'all'")
    parser.add_argument("--dataset", help="Dataset name (e.g. math_basic), or 'all'")
    parser.add_argument("--save-baseline", action="store_true", help="Save results as baseline")
    parser.add_argument("--name", help="Name of the baseline to save or compare")
    parser.add_argument("--baseline", help="Name of the baseline to compare against")
    
    args = parser.parse_args()
    
    if args.command == "health":
        print("Running health checks...")
        for name, provider in REGISTRY.items():
            status = await provider.health_check()
            print(f"[{name}] {'✅ OK' if status else '❌ Failed'}")
        return

    if args.command == "compare":
        if not args.baseline:
            print("Error: --baseline is required for compare command")
            return
            
        baseline = load_baseline(args.baseline)
        if not baseline:
            print(f"Error: Baseline '{args.baseline}' not found in baselines/")
            return
            
        # For comparison, we need the current results. 
        # Typically you'd run and compare in one go, or compare two baseline files.
        # Let's say we just compare the latest run with a baseline.
        results_dir = Path("results")
        if not results_dir.exists():
            print("No results found to compare. Run tests first.")
            return
            
        json_files = list(results_dir.glob("*.json"))
        if not json_files:
            print("No JSON result files found to compare.")
            return
            
        latest_result = max(json_files, key=lambda p: p.stat().st_mtime)
        with open(latest_result, "r", encoding="utf-8") as f:
            current = json.load(f)
            
        comp = compare_with_baseline(current, baseline)
        print(f"Comparing latest run ({latest_result.name}) against baseline '{args.baseline}':")
        print(f"- Comparisons made: {comp['comparisons']}")
        print(f"- Score delta: {comp['score_delta']:.2f}")
        print(f"- Improvements: {len(comp['improvements'])}")
        for imp in comp['improvements']:
            print(f"   * {imp['provider']} on {imp['test_id']}: {imp['old_score']} -> {imp['new_score']}")
        print(f"- Regressions: {len(comp['regressions'])}")
        for reg in comp['regressions']:
            print(f"   * {reg['provider']} on {reg['test_id']}: {reg['old_score']} -> {reg['new_score']}")
        return

    if args.command == "run":
        if not args.providers or not args.dataset:
            print("Error: --providers and --dataset are required for run command")
            return
            
        # Resolve providers
        if "all" in args.providers:
            providers = list(REGISTRY.keys())
        else:
            providers = [p for p in args.providers if p in REGISTRY]
            if not providers:
                print("Error: No valid providers selected")
                return

        # Load datasets
        dataset_dir = Path("datasets")
        test_cases = []
        
        if args.dataset == "all":
            files = list(dataset_dir.glob("*.jsonl"))
        else:
            files = [dataset_dir / f"{args.dataset}.jsonl"]
            
        for fpath in files:
            if not fpath.exists():
                print(f"Warning: Dataset file not found: {fpath}")
                continue
            with open(fpath, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        test_cases.append(json.loads(line))
                        
        if not test_cases:
            print("Error: No test cases loaded")
            return
            
        print(f"Running {len(test_cases)} test cases across {len(providers)} providers...")
        results = await run_suite(test_cases, providers)
        
        print_table(results)
        export_results(results)
        
        if args.save_baseline:
            name = args.name or f"baseline_{args.dataset}"
            save_baseline([r.__dict__ for r in results], name)

if __name__ == "__main__":
    asyncio.run(main())
