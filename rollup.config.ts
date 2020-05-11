/* eslint-disable import/no-extraneous-dependencies */
import { RollupOptions, ExternalOption, Plugin, WatcherOptions } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import filesize from 'rollup-plugin-filesize';
import pkg from './package.json';

const external: ExternalOption = ['react', 'react-dom', 'react-router-dom'];
const tsconfig = './tsconfig.json';
const plugins: Plugin[] = [
  typescript({ tsconfig, clean: true }),
  resolve(),
  cleanup({ comments: 'none' }),
  filesize(),
];
const watch: WatcherOptions = { include: ['src/**'] };

const esOptions: RollupOptions = {
  input: pkg.source,
  external,
  output: {
    file: pkg.module,
    format: 'es',
  },
  plugins,
  watch,
};

const options: RollupOptions[] = [esOptions];

export default options;
