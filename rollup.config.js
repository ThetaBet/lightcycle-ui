import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const typescriptPlugin = typescript({ tsconfig: './tsconfig.json', sourceMap: true });

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vide.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [typescriptPlugin]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vide.esm.min.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [typescriptPlugin, terser()]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vide.umd.js',
      name: 'Vide',
      format: 'umd',
      sourcemap: true
    },
    plugins: [typescriptPlugin]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/vide.umd.min.js',
      name: 'Vide',
      format: 'umd',
      sourcemap: true
    },
    plugins: [typescriptPlugin, terser()]
  }
];
