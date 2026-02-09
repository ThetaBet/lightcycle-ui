export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/lightcycle-ui.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/lightcycle-ui.umd.js',
      name: 'LightCycleUI',
      format: 'umd',
      sourcemap: true
    },
    plugins: [
    ]
  }
];
