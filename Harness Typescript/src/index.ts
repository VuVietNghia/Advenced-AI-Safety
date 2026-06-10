import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { REGISTRY } from './providers/index.js';
import { TestCase, runSuite } from './harness/runner.js';
import { printTable, exportResults } from './harness/reporter.js';
import { loadBaseline, saveBaseline, compareWithBaseline } from './harness/baseline.js';

const program = new Command();

program
  .name('harness')
  .description('LLM Test Harness in TypeScript')
  .version('1.0.0');

program.command('health')
  .description('Run health checks on configured providers')
  .action(async () => {
    console.log("Running health checks...");
    for (const [name, provider] of Object.entries(REGISTRY)) {
      const status = await provider.healthCheck();
      console.log(`[${name}] ${status ? '✅ OK' : '❌ Failed'}`);
    }
  });

program.command('run')
  .description('Run evaluation suite')
  .requiredOption('-p, --providers <names...>', 'List of providers (e.g. claude lm_studio)')
  .requiredOption('-d, --dataset <name>', 'Dataset name (e.g. math_basic)')
  .option('--save-baseline', 'Save results as baseline')
  .option('--name <name>', 'Name of the baseline to save')
  .action(async (options) => {
    const selectedProviders = [];
    if (options.providers.includes("all")) {
      selectedProviders.push(...Object.values(REGISTRY));
    } else {
      for (const p of options.providers) {
        if (REGISTRY[p]) {
          selectedProviders.push(REGISTRY[p]);
        } else {
          console.warn(`Warning: Provider '${p}' not found.`);
        }
      }
    }

    if (selectedProviders.length === 0) {
      console.error("Error: No valid providers selected.");
      process.exit(1);
    }

    const datasetDir = path.resolve('datasets');
    const files: string[] = [];

    if (options.dataset === "all") {
      const allFiles = fs.readdirSync(datasetDir);
      files.push(...allFiles.filter(f => f.match(/\.jsonl?$/)).map(f => path.join(datasetDir, f)));
    } else {
      let fpath = path.join(datasetDir, `${options.dataset}.json`);
      if (!fs.existsSync(fpath)) fpath = path.join(datasetDir, `${options.dataset}.jsonl`);
      files.push(fpath);
    }

    const testCases: TestCase[] = [];
    for (const fpath of files) {
      if (!fs.existsSync(fpath)) {
        console.warn(`Warning: Dataset file not found: ${fpath}`);
        continue;
      }
      const content = fs.readFileSync(fpath, 'utf-8');
      if (fpath.endsWith('.json')) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          testCases.push(...parsed);
        } else {
          testCases.push(parsed);
        }
      } else {
        const lines = content.split('\n');
        for (const line of lines) {
          if (line.trim()) {
            testCases.push(JSON.parse(line));
          }
        }
      }
    }

    if (testCases.length === 0) {
      console.error("Error: No test cases loaded.");
      process.exit(1);
    }

    console.log(`Running ${testCases.length} test cases across ${selectedProviders.length} providers...`);
    const results = await runSuite(testCases, selectedProviders);
    
    printTable(results);
    await exportResults(results);

    if (options.saveBaseline) {
      const name = options.name || `baseline_${options.dataset}`;
      saveBaseline(results, name);
    }
  });

program.command('compare')
  .description('Compare latest run with a baseline')
  .requiredOption('-b, --baseline <name>', 'Baseline name to compare against')
  .action((options) => {
    const baseline = loadBaseline(options.baseline);
    if (!baseline) {
      console.error(`Error: Baseline '${options.baseline}' not found in baselines/`);
      process.exit(1);
    }

    const resultsDir = path.resolve('results');
    if (!fs.existsSync(resultsDir)) {
      console.error("No results found to compare. Run tests first.");
      process.exit(1);
    }

    const files = fs.readdirSync(resultsDir).filter(f => f.endsWith('.json')).sort();
    if (files.length === 0) {
      console.error("No result JSON files found.");
      process.exit(1);
    }

    const latestFile = path.join(resultsDir, files[files.length - 1]);
    const currentResults = JSON.parse(fs.readFileSync(latestFile, 'utf-8'));

    compareWithBaseline(currentResults, baseline);
  });

program.parse(process.argv);
