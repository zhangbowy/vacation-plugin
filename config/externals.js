const path = require('path');
const { existsSync } = require('fs');

const externals = {
  react: 'window.React',
  'react-dom': 'window.ReactDOM',
};

const scripts = [
  '//cdn.jsdelivr.net/npm/react@${version}/umd/react.production.min.js',
  '//cdn.jsdelivr.net/npm/react-dom@${version}/umd/react-dom.production.min.js',
];

Object.keys(externals).forEach((key, idx) => {
  const pkgJSONPath = path.join(__dirname, '../node_modules', key, 'package.json');
  const pkgJSONExists = existsSync(pkgJSONPath);
  if (pkgJSONExists) {
    const packageJson = require(pkgJSONPath);
    scripts[idx] = scripts[idx].replace('${version}', packageJson.version);
  }
});

export { externals, scripts };
