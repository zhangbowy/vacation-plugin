// https://umijs.org/config/
import { defineConfig } from 'umi';

import headScripts from './headScripts';
import { externals, scripts } from './externals';

export default defineConfig({
  externals,
  scripts,
});
