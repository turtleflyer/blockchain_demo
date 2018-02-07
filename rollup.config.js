// rollup.config.js

import bowerResolve from 'rollup-plugin-bower-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/main.js',
	output: {
		file: 'public/bundle.js',
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: true
    },
    plugins: [
        bowerResolve({
            // The working directory to use with bower (i.e the directory where
            // the `bower.json` is stored).
            // Default is `process.cwd()`.
            cwd: '/sjcl',
    
            // Use `bower` offline.
            // Default is `true`.
            offline: false,
    
            // // Use "module" field for ES6 module if possible, default is `true`.
            // // See: https://github.com/rollup/rollup/wiki/pkg.module
            // module: true,
    
            // // Use "jsnext:main" field for ES6 module if possible, default is `true`.
            // // This field should not be used, use `module` entry instead, but it is `true`
            // // by default because of legacy packages.
            // // See: https://github.com/rollup/rollup/wiki/jsnext:main
            // jsnext: true,
    
            // // if there's something your bundle requires that you DON'T
            // // want to include, add it to 'skip'
            // skip: [ 'some-big-dependency' ],  // Default: []
    
            // // Override path to main file (relative to the module directory).
            // override: {
            //   lodash: 'dist/lodash.js'
            // }
        }),
    commonjs()
  ]
};