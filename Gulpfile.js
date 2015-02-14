var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('scripts', function () {

  gulp.src(['./lib/app/bootstrap.js'])
    .pipe(browserify({
      'debug': true,
      'transform': ['reactify']
    }))
    .pipe(gulp.dest('./lib/app/public/'));
});

gulp.task('watch', function () {

   gulp.watch('./lib/app/components/**/*', ['scripts']);
});

gulp.task('default', ['scripts']);