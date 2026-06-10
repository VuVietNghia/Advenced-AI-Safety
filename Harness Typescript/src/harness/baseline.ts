import fs from 'fs';
import path from 'path';

export function saveBaseline(results: any[], name: string): void {
  const baselinesDir = path.resolve('baselines');
  if (!fs.existsSync(baselinesDir)) {
    fs.mkdirSync(baselinesDir, { recursive: true });
  }

  if (!name.endsWith('.json')) {
    name += '.json';
  }

  const outPath = path.join(baselinesDir, name);
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Baseline saved to ${outPath}`);
}

export function loadBaseline(name: string): any[] | null {
  const baselinesDir = path.resolve('baselines');
  if (!name.endsWith('.json')) {
    name += '.json';
  }

  const inPath = path.join(baselinesDir, name);
  if (!fs.existsSync(inPath)) {
    return null;
  }

  const content = fs.readFileSync(inPath, 'utf-8');
  return JSON.parse(content);
}

export function compareWithBaseline(currentResults: any[], baselineResults: any[]): void {
  // Đơn giản hóa: Chuyển array thành map với key = provider_testId
  const baselineMap = new Map();
  baselineResults.forEach(r => {
    baselineMap.set(`${r.provider}_${r.test_id}`, r);
  });

  let improvements = 0;
  let regressions = 0;

  console.log("\n--- Baseline Comparison ---");

  currentResults.forEach(r => {
    const key = `${r.provider}_${r.test_id}`;
    if (baselineMap.has(key)) {
      const b = baselineMap.get(key);
      const diff = r.score - b.score;

      if (diff > 0) {
        console.log(`[${r.provider}] ${r.test_id}: Cải thiện (+${diff.toFixed(2)})`);
        improvements++;
      } else if (diff < 0) {
        console.log(`[${r.provider}] ${r.test_id}: ĐI LÙI/REGRESSION (${diff.toFixed(2)})`);
        regressions++;
      }
    } else {
      console.log(`[${r.provider}] ${r.test_id}: Không có trong baseline`);
    }
  });

  console.log(`\nTổng kết: ${improvements} cải thiện, ${regressions} đi lùi.`);
}
