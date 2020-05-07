/* eslint-disable import/no-extraneous-dependencies */
import {
  RollupOptions,
  ExternalOption,
  InputOption,
  Plugin,
  WatcherOptions,
} from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import filesize from 'rollup-plugin-filesize';

const input: InputOption = 'src/index.ts';
const external: ExternalOption = id =>
  !!id.match(/^(react|react-dom|history|react-router|react-router-dom)/);
const tsconfig = './tsconfig.json';
const plugins: Plugin[] = [
  typescript({ tsconfig, clean: true }),
  resolve(),
  cleanup({ comments: 'none' }),
  filesize(),
];
const watch: WatcherOptions = { include: ['src/**'] };

const esOptions: RollupOptions = {
  input,
  external,
  output: {
    file: 'dist/index.es.js',
    format: 'es',
  },
  plugins,
  watch,
};

const options: RollupOptions[] = [esOptions];

export default options;
