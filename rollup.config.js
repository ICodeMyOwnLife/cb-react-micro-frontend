import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import filesize from 'rollup-plugin-filesize';

const input = 'src/index.ts';
const external = id =>
  !!id.match(/^(react|react-dom|history|react-router|react-router-dom)/);
const tsconfig = './tsconfig.json';
const plugins = [
  typescript({ tsconfig, clean: true }),
  resolve(),
  cleanup({ comments: 'none' }),
  filesize(),
];
const watch = { include: ['src/**'] };
const esOptions = {
  input,
  external,
  output: {
    file: 'dist/index.es.js',
    format: 'es',
  },
  plugins,
  watch,
};
const options = [esOptions];
export default options;
