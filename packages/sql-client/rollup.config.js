import localResolve from 'rollup-plugin-local-resolve';

module.exports = {
    input: 'src/index.js',
    output: {
      file: `lib/index.js`,
      name: '@front-n-back/sql-client',
      format: 'umd'
    },
    plugins: [
      localResolve(),
    ]
};