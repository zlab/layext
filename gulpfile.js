const gulp = require('gulp');
const pump = require('pump');
const shell = require('shelljs');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

const dest = 'build/';
const shim = 'shim.min.js';
const extend = 'extend.min.js';

gulp.task('shim', function(cb) {
  shell.rm('-rf', dest + shim);

  pump([
    gulp.src([
      'node_modules/console-polyfill/index.js',
      'node_modules/es5-shim/es5-shim.min.js',
      'node_modules/es5-shim/es5-sham.min.js',
      'node_modules/es6-shim/es6-shim.min.js',
      'node_modules/es6-shim/es6-sham.min.js',
      'node_modules/json3/lib/json3.min.js',
      'node_modules/html5shiv/dist/html5shiv.min.js',
      'node_modules/Respond.js/dest/respond.min.js'
    ]),
    concat(shim),
    uglify(),
    gulp.dest(dest)
  ], cb);
});

gulp.task('extend', function(cb) {
  shell.rm('-rf', dest + extend);

  pump([
    gulp.src([
      'src/base.js',
      'src/ajax.js',
      'src/tpl.js',
      'src/dialog.js',
      'src/element.js',
      'src/upload.js',
      'src/router.js',
      'src/table.js'
    ]),
    concat(extend),
    uglify(),
    gulp.dest(dest)
  ], cb);
});

gulp.task('copy', ['shim', 'extend'], function() {
  const ylynPath = 'ylyn/ylyn-admin/static/';
  const macDir = '/Users/zhanqi/Aliyun/' + ylynPath;
  const winDir = 'D:/Aliyun/' + ylynPath;
  const destDir = process.platform === 'darwin' ? macDir : winDir;

  gulp.src(dest + shim).pipe(gulp.dest(destDir + 'shim'));
  gulp.src(dest + extend).pipe(gulp.dest(destDir + 'extend'));
});
