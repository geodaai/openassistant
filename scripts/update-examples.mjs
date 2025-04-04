import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the current version from package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../packages/common/package.json'), 'utf-8')
);

// update version in examples/lisa/package.json
function updateExamplesPackageJson(projectName) {
  // replace dependencies of "@geoda/lisa", "@geoda/core", or "@geoda/regression" with the new version
  const examplesDir = join(__dirname, `../../examples/${projectName}`);
  const examplesPackageJson = JSON.parse(readFileSync(join(examplesDir, 'package.json'), 'utf-8'));
  // check if dependencies exist
  if (examplesPackageJson.dependencies['@geoda/lisa']) {
    examplesPackageJson.dependencies['@geoda/lisa'] = `${packageJson.version}`;
  }
  if (examplesPackageJson.dependencies['@geoda/core']) {
    examplesPackageJson.dependencies['@geoda/core'] = `${packageJson.version}`;
  }
  if (examplesPackageJson.dependencies['@geoda/regression']) {
    examplesPackageJson.dependencies['@geoda/regression'] = `${packageJson.version}`;
  }
  writeFileSync(join(examplesDir, 'package.json'), JSON.stringify(examplesPackageJson, null, 2));
}

updateExamplesPackageJson('lisa');
updateExamplesPackageJson('mapping');
updateExamplesPackageJson('node');
updateExamplesPackageJson('parcel');
updateExamplesPackageJson('regression');

console.log(`Updated examples to version ${packageJson.version}`);
