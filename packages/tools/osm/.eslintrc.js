// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

module.exports = {
  extends: ['../../../.eslintrc.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    'src/us/script/*.js',
  ],
};
