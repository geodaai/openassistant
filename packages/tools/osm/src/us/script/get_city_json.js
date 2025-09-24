// listCities.js
const fetch = require('node-fetch'); // or “undici” or built-in fetch in newer Node.js
require('dotenv').config(); // if using .env for the token

const OWNER = 'generalpiston';
const REPO = 'geojson-us-city-boundaries';
const ROOT_PATH = 'cities';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // set this in your environment

async function listDirContents(path) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  const headers = {
    Accept: 'application/vnd.github+json',
  };
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }
  const resp = await fetch(url, { headers });
  if (!resp.ok) {
    throw new Error(
      `GitHub API error: ${resp.status} ${resp.statusText} at path ${path}`
    );
  }
  const data = await resp.json();
  return data; // an array of items, each with { name, path, type, ... }
}

async function recurse(path, results = []) {
  const items = await listDirContents(path);
  for (const item of items) {
    if (item.type === 'dir') {
      // Recurse into subdirectory
      await recurse(item.path, results);
    } else if (item.type === 'file' && item.name.endsWith('.json')) {
      // Push relative path like state/city.json
      // item.path is something like "cities/AK/Anchorage.json"
      const rel = item.path.split('/').slice(1).join('/');
      // Slice(1) removes the "cities" prefix.
      results.push(rel);
    }
  }
  return results;
}

(async () => {
  try {
    const files = await recurse(ROOT_PATH);
    // files will be ["AK/Anchorage.json", "AK/Fairbanks.json", …]
    console.log(files.join('\n'));
    // Optionally: write to a file
    const fs = require('fs');
    fs.writeFileSync('cityFiles.txt', files.join('\n'), 'utf8');
    console.log('Saved to cityFiles.txt');
  } catch (err) {
    console.error('Error:', err);
  }
})();
