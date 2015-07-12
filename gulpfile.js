'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var transform = require('vinyl-transform');
var browserify = require('browserify');
var babelify = require('babelify');
var del = require('del');
var bs = require('browser-sync').create();
var sequence = require('run-sequence');

/**
 * Styles
 */

 gulp.task('styles:clean', function (cb) {
   del(['test/styles/**'], cb);
 });

gulp.task('styles', ['styles:clean'], function () {
  return gulp.src('styles/app.less')
    .pipe($.less())
    .pipe(gulp.dest('test/styles'))
    .pipe(bs.reload({ stream: true }));
});

/**
 * Scripts
 */

gulp.task('scripts:clean', function (cb) {
  del(['test/scripts/**'], cb);
});

gulp.task('scripts', ['scripts:clean'], function () {
  var bundle = transform(function (filename) {
    return browserify(filename)
      .transform(babelify)
      .bundle();
  });

  return gulp.src('scripts/app.js')
    .pipe(bundle)
    .pipe(gulp.dest('test/scripts'))
    .pipe(bs.reload({ stream: true }));
});

/**
 * Assets
 */

 gulp.task('assets:clean', function (cb) {
   del(['test/assets/**/*'], cb);
 })

 gulp.task('assets', ['assets:clean'], function () {
   return gulp.src('assets/**/*')
    .pipe(gulp.dest('test/assets'))
    .pipe(bs.reload({ stream: true }));
 });

/**
 * Layouts
 */

 gulp.task('layouts:clean', function (cb) {
   del(['test/**/*.html'], cb);
 });

 gulp.task('layouts', ['layouts:clean'], function () {
   gulp.src('index.html')
    .pipe(gulp.dest('test'));
 });

 /**
  * Watching, serving and building
  */

gulp.task('build', ['scripts', 'styles', 'assets', 'layouts'], function () { });

gulp.task('watch', ['build'], function () {
  gulp.watch('styles/**/*', ['styles']);
  gulp.watch('scripts/**/*', ['scripts']);
  gulp.watch('**/*.html', function () {
    sequence('layouts', bs.reload);
  });
  gulp.watch('assets/**/*', ['assets']);
});

gulp.task('serve', function () {
  bs.init({
    server: './test',
    open: false
  });
});

gulp.task('default', ['watch', 'serve']);
