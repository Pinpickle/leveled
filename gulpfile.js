'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var del = require('del');
var snippet = false;
var sequence = require('run-sequence');


var onError = function onError(err) {
  console.log(err.message);
  this.emit('end');
};

/**
 * Styles
 */

 gulp.task('styles:clean', function (cb) {
   del(['test/styles/**'], cb);
 });

gulp.task('styles', ['styles:clean'], function () {
  return gulp.src('styles/app.less')
    .pipe($.plumber())
    .pipe($.less())
    .pipe(gulp.dest('test/styles'))
    .pipe($.livereload());
});

/**
 * Scripts
 */

gulp.task('scripts:clean', function (cb) {
  del(['test/scripts/**'], cb);
});

gulp.task('scripts', ['scripts:clean'], function () {
  return browserify('scripts/app.js')
    .transform(babelify)
    .bundle()
    .on('error', onError)
    .pipe(source('app.js'))
    .pipe($.buffer())
    .pipe(gulp.dest('test/scripts'))
    .pipe($.livereload());
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
    .pipe($.livereload());
 });

/**
 * Layouts
 */


 gulp.task('layouts:clean', function (cb) {
   del(['test/**/*.html'], cb);
 });

 gulp.task('layouts', ['layouts:clean'], function () {
   gulp.src('index.html')
    .pipe($.if(!!snippet, $.replace('<!-- injected-code -->', snippet)))
    .pipe(gulp.dest('test'))
    .pipe($.livereload());
 });

 /**
  * Watching, serving and building
  */

gulp.task('build', ['scripts', 'styles', 'assets', 'layouts'], function () { });

gulp.task('watch', function () {
  gulp.watch('styles/**/*', ['styles']);
  gulp.watch('scripts/**/*', ['scripts']);
  gulp.watch('**/*.html', ['layouts']);
  gulp.watch('assets/**/*', ['assets']);
});

gulp.task('run', function () {
  $.run('electron .').exec();
});

gulp.task('serve', ['watch'], function () {
  $.livereload.listen();
  snippet = '<script src="http://localhost:35729/livereload.js"></script>';
});

gulp.task('default', function () {
  sequence('serve', 'build', ['run', 'watch']);
});
