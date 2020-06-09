import localResolve from 'rollup-plugin-local-resolve';

module.exports = {
    input: 'src/index.js',
    output: {
      file: `lib/index.js`,
      name: '@front-n-back/k8s-secret',
      format: 'umd'
    },
    plugins: [
      localResolve(),
    ]
};