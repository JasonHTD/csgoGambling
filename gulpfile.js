var gulp = require("gulp");
var concat = require("gulp-concat");
var cssMin = require("gulp-minify-css");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");

gulp.task("default", ["scripts", "styles", "watch"]);
gulp.task("scripts", function(){
  return gulp.src("./public/js/src/*.js")
  .pipe(uglify())
  .pipe(rename({
    suffix: ".min"
  }))
  .pipe(gulp.dest("./public/js/dist/"))
});
gulp.task("styles", function(){

  return gulp.src("./public/css/src/*.scss")
  .pipe(sass())
  .pipe(cssMin())
  .pipe(rename({
    suffix: ".min"
  }))
  .pipe(gulp.dest("./public/css/dist/"))
});
gulp.task("watch", function(){
  gulp.watch("./public/js/src/*.js", [
    "scripts"
  ]);
  gulp.watch("./public/css/src/*.scss", [
    "styles"
  ]);
})
