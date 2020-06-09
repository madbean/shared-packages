import localResolve from 'rollup-plugin-local-resolve';

module.exports = {
    input: 'src/index.js',
    output: {
      file: `lib/index.js`,
      name: '@fnb/ramda',
      format: 'umd'
    },
    plugins: [
      localResolve(),
    ]
};