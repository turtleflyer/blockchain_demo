import { rollup } from 'rollup';
import bowerResolve from 'rollup-plugin-bower-resolve';

rollup({
  entry: 'src/main.js',
  plugins: [
    bowerResolve({
      // The working directory to use with bower (i.e the directory where
      // the `bower.json` is stored).
      // Default is `process.cwd()`.
      cwd: '/sjcl',

      // Use `bower` offline.
      // Default is `true`.
    //   offline: false,

    //   // Use "module" field for ES6 module if possible, default is `true`.
    //   // See: https://github.com/rollup/rollup/wiki/pkg.module
    //   module: true,

    //   // Use "jsnext:main" field for ES6 module if possible, default is `true`.
    //   // This field should not be used, use `module` entry instead, but it is `true`
    //   // by default because of legacy packages.
    //   // See: https://github.com/rollup/rollup/wiki/jsnext:main
    //   jsnext: main,

      // if there's something your bundle requires that you DON'T
      // want to include, add it to 'skip'
    //   skip: [ 'some-big-dependency' ],  // Default: []

      // Override path to main file (relative to the module directory).
    //   override: {
    //     lodash: 'dist/lodash.js'
    //   }
    })
  ]
}).then( bundle => bundle.write({ dest: 'public/bundle.js', format: 'iife' }) );