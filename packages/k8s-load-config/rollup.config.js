import localResolve from 'rollup-plugin-local-resolve';

module.exports = {
    input: 'src/index.js',
    output: {
      file: `lib/index.js`,
      name: '@jchurque/k8s-load-config',
      format: 'umd'
    },
    plugins: [
      localResolve(),
    ]
};