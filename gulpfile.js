'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
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

function generateBrowserify(path) {
  var bundle = browserify({
    entries: [path],
    debug: true,
    cache: { },
    packageCache: { }
  });

  watchify(bundle);

  bundle.on('update', bundleBrowserify.bind(this, bundle));
  bundle.on('log', $.util.log);

  return bundle.transform(babelify);
}

var bundle = generateBrowserify('scripts/app.js');

function bundleBrowserify(bundle) {
  return bundle
    .bundle()
    .on('error', onError)
    .pipe(source('app.js'))
    .pipe($.buffer())
    .pipe($.sourcemaps.init())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('test/scripts'))
    .pipe($.livereload());
}

gulp.task('scripts:clean', function (cb) {
  del(['test/scripts/**'], cb);
});

gulp.task('scripts', ['scripts:clean'], function () {
  return bundleBrowserify(bundle);
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
  gulp.watch('./index.html', ['layouts']);
  gulp.watch('assets/**/*', ['assets']);

  var b = generateBrowserify('scripts/app.js', true);
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
