var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var beautify = require('gulp-beautify');
var jshint = require('gulp-jshint');
var async = require('async');
var bump = require('gulp-bump'),
    glob = require('glob'),
    Handlebars = require('handlebars'),
    HandlebarsIntl = require('handlebars-intl');

gulp.task('handlebars', function (cb) {
  HandlebarsIntl.registerWith(Handlebars);
  glob("./static/templates/partials/*.hbt", function (er, files) {
    async.each(files, function (file, asynccb) {
      fs.readFile(file, function (error, content) {
        Handlebars.registerPartial(path.basename(file, '.hbt'), content.toString());
        asynccb(error);
      });
    }, function (error) {
      Handlebars.registerHelper('limit', function (collection, limit, start) {
        return collection.slice(start, limit + 1);
      });
      Handlebars.registerHelper('safe', function (contents) {
        return new Handlebars.SafeString(contents);
      });
      Handlebars.registerHelper('year', function (contents) {
        return contents.getFullYear();
      });
      cb(error);
    });
  });
});

gulp.task('lint', ['beautify'], function () {
  return gulp.src(['./*.js', 'static/js/**/*.js']).pipe(jshint()).pipe(jshint.reporter('default'));
});

gulp.task('bump', [], function () {
  return gulp.src(['./package.json']).pipe(bump({
    type: 'patch'
  })).pipe(gulp.dest('./'));
});

gulp.task('beautify', function () {
  return gulp.src(['./app/**/*.js', 'gulpfile.js'], {
    base: '.'
  }).pipe(beautify({
    indentSize: 2
  })).pipe(gulp.dest('.'));
});

gulp.task('heroku:production', ['submodules']);

gulp.task('test', function () {
  // place code for your default task here
});

gulp.task('default', ['submodules', 'lint', 'bump', 'handlebars']);

gulp.task('submodules', function () {
  return gulp.src('modules/**/*').pipe(gulp.dest('node_modules'));
});