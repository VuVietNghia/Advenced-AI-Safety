import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env if present
dotenv.config();

// Attempt to load settings.json from parent folder
let settings: any = {};
try {
  const rootDir = path.resolve(__dirname, '../../../');
  const settingsPath = path.join(rootDir, 'settings.json');
  if (fs.existsSync(settingsPath)) {
    const data = fs.readFileSync(settingsPath, 'utf8');
    settings = JSON.parse(data);
  }
} catch (e) {
  console.warn("Could not load settings.json:", e);
}

export function getEnv(key: string, defaultValue: string = ""): string {
  if (process.env[key] !== undefined && process.env[key] !== "") {
    return process.env[key] as string;
  }
  if (settings.env && settings.env[key] !== undefined && settings.env[key] !== "") {
    return settings.env[key];
  }
  return defaultValue;
}
