var gulp = require('gulp');
var pump = require('pump');
var shell = require('shelljs');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var package = require("./package.json");

var dest = 'build/';
var layextDir = '/Users/zhanqi/Jianyun/hd/new/ui/ui-static/layext';
var bundle = package.name + '.min.js';

gulp.task('default', function (cb) {
  // shell.rm('-rf', dest);

  pump([
    gulp.src([
      'node_modules/console-polyfill/index.js',
      'node_modules/es5-shim/es5-shim.min.js',
      'node_modules/es5-shim/es5-sham.min.js',
      'node_modules/es6-shim/es6-shim.min.js',
      'node_modules/es6-shim/es6-sham.min.js',
      'node_modules/json3/lib/json3.min.js',
      'node_modules/html5shiv/dist/html5shiv.min.js',
      'node_modules/Respond.js/dest/respond.min.js',
      'node_modules/qs/dist/qs.js',
      'node_modules/moment/min/moment.min.js',
      'node_modules/moment/locale/zh-cn.js',
      'node_modules/nunjucks/browser/nunjucks.min.js',
      'src/base.js',
      'src/ajax.js',
      'src/tpl.js',
      'src/dialog.js',
      'src/element.js',
      'src/upload.js',
      'src/table.js'
    ]),
    concat(bundle),
    uglify(),
    gulp.dest(dest)
  ], cb);
});

gulp.task('copy', ['default'], function () {
  gulp.src(dest + '*.js').pipe(gulp.dest(layextDir))
});
