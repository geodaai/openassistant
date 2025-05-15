import { readFileSync, writeFileSync, readdirSync } from 'fs';
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
  // replace dependencies of "@openassistant/core", "@openassistant/ui", or "@openassistant/components" with the new version
  const examplesDir = join(__dirname, `../../examples/${projectName}`);
  const examplesPackageJson = JSON.parse(readFileSync(join(examplesDir, 'package.json'), 'utf-8'));
  // check if dependencies exist
  if (examplesPackageJson.dependencies['@openassistant/core']) {
    examplesPackageJson.dependencies['@openassistant/core'] = `${packageJson.version}`;
  }
  if (examplesPackageJson.dependencies['@openassistant/ui']) {
    examplesPackageJson.dependencies['@openassistant/ui'] = `${packageJson.version}`;
  }
  if (examplesPackageJson.dependencies['@openassistant/components']) {
    examplesPackageJson.dependencies['@openassistant/components'] = `${packageJson.version}`;
  }
  if (examplesPackageJson.dependencies['@openassistant/duckdb']) {
    examplesPackageJson.dependencies['@openassistant/duckdb'] = `${packageJson.version}`;
  }
  if (examplesPackageJson.dependencies['@openassistant/plots']) {
    examplesPackageJson.dependencies['@openassistant/plots'] = `${packageJson.version}`;
  }
  if (examplesPackageJson.dependencies['@openassistant/geoda']) {
    examplesPackageJson.dependencies['@openassistant/geoda'] = `${packageJson.version}`;
  }
  if (examplesPackageJson.dependencies['@openassistant/keplergl']) {
    examplesPackageJson.dependencies['@openassistant/keplergl'] = `${packageJson.version}`;
  }
  if (examplesPackageJson.dependencies['@openassistant/osm']) {
    examplesPackageJson.dependencies['@openassistant/osm'] = `${packageJson.version}`;
  }
  if (examplesPackageJson.dependencies['@openassistant/utils']) {
    examplesPackageJson.dependencies['@openassistant/utils'] = `${packageJson.version}`;
  }
  if (examplesPackageJson.dependencies['@openassistant/map']) {
    examplesPackageJson.dependencies['@openassistant/map'] = `${packageJson.version}`;
  }
  writeFileSync(join(examplesDir, 'package.json'), JSON.stringify(examplesPackageJson, null, 2));
}

// get the names of directories in examples
const examplesDirs = readdirSync(join(__dirname, '../../examples'));

// update version in all examples
examplesDirs.forEach(exampleDir => {
  console.log(`Updating ${exampleDir}`);
  updateExamplesPackageJson(exampleDir);
});

console.log(`Updated examples to version ${packageJson.version}`);
