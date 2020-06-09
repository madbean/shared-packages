import localResolve from 'rollup-plugin-local-resolve';

module.exports = {
    input: 'src/index.js',
    output: {
      file: `lib/index.js`,
      name: '@jchurque/sql-client',
      format: 'umd'
    },
    plugins: [
      localResolve(),
    ]
};