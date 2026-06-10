import fs from 'fs';
import path from 'path';
import Table from 'cli-table3';
import { createObjectCsvWriter } from 'csv-writer';
import { TestResult } from './runner.js';

export function printTable(results: TestResult[]): void {
  const table = new Table({
    head: ['Provider', 'Test ID', 'Pass', 'Score', 'Latency', 'Reason', 'Error']
  });

  results.forEach(r => {
    let reason = r.reason;
    if (reason.length > 50) reason = reason.substring(0, 50) + "...";
    
    let error = r.error;
    if (error.length > 30) error = error.substring(0, 30) + "...";

    table.push([
      r.provider,
      r.test_id,
      r.passed ? '✅' : '❌',
      r.score.toFixed(2),
      `${r.latency_ms}ms`,
      reason,
      error
    ]);
  });

  console.log(table.toString());

  // In summary
  console.log("\n--- Summary ---");
  const summaryTable = new Table({
    head: ['Provider', 'Pass Rate', 'Avg Score', 'Avg Latency']
  });

  const providers = [...new Set(results.map(r => r.provider))];
  providers.forEach(p => {
    const pResults = results.filter(r => r.provider === p);
    const passed = pResults.filter(r => r.passed).length;
    const passRate = (passed / pResults.length) * 100;
    const avgScore = pResults.reduce((sum, r) => sum + r.score, 0) / pResults.length;
    const avgLatency = pResults.reduce((sum, r) => sum + r.latency_ms, 0) / pResults.length;

    summaryTable.push([
      p,
      `${passRate.toFixed(1)}%`,
      avgScore.toFixed(2),
      `${Math.round(avgLatency)}ms`
    ]);
  });

  console.log(summaryTable.toString());
}

export async function exportResults(results: TestResult[]): Promise<void> {
  const resultsDir = path.resolve('results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '').replace('T', '_').slice(0, 15);
  const jsonPath = path.join(resultsDir, `run_${timestamp}.json`);
  const csvPath = path.join(resultsDir, `run_${timestamp}.csv`);

  // Lưu JSON
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Results saved to JSON: ${jsonPath}`);

  // Lưu CSV đẹp hơn theo yêu cầu user
  const csvWriter = createObjectCsvWriter({
    path: csvPath,
    header: [
      { id: 'provider', title: 'Provider' },
      { id: 'test_id', title: 'Test ID' },
      { id: 'passed', title: 'Status' },
      { id: 'score', title: 'Score (0-1)' },
      { id: 'latency_ms', title: 'Latency (ms)' },
      { id: 'reason', title: 'Reason/Details' },
      { id: 'error', title: 'Error Message' }
    ]
  });

  const csvRecords = results.map(r => ({
    ...r,
    passed: r.passed ? 'PASSED' : 'FAILED'
  }));

  await csvWriter.writeRecords(csvRecords);
  console.log(`Results saved to CSV: ${csvPath}`);
}
