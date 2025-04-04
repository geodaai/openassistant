import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the current version from package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../packages/common/package.json'), 'utf-8')
);

// Update version.ts
const VERSION_FILE = join(__dirname, '../packages/common/src/version.ts');
const versionContent = `export const VERSION = '${packageJson.version}';\n`;
writeFileSync(VERSION_FILE, versionContent);

console.log(`Updated version.ts to version ${packageJson.version}`);
