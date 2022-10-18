//--Gulp.js V4--//
const devUrlWithPort = '';
const fs = require('fs');
const root = __dirname;
const source = root;
const gulp = require('gulp');
const csso = require('gulp-csso');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync	= require('browser-sync');
const del = require('del');

//--PATHS--//
const paths = {
  css: {
    src: source + '/css/**/*.css',
  },
  scss: {
    src: source + '/sass/**/*.scss',
    dest: source + '/sass/compiled/'
  },
  styles: {
    dest: source + '/dist/css/'
  },
  js: {
    src: source + '/js/**/*.js',
    dest: source + '/dist/js/'
  },
  html: {
    src: source + '/*.html'
  }
};
console.log('CSS Source: ' + paths.css.src);
console.log('SASS Source: ' + paths.scss.src);
console.log('CSS & SASS Destination: ' + paths.styles.dest);
console.log('jQuery Source: ' + source + '/js/jquery/*.js');
console.log('JS Source: ' + paths.js.src);
console.log('JS Destination: ' + paths.js.dest);
console.log('HTML Source: ' + paths.html.src);

//--TASKS--//
//Clean
function clean() {
  return del([
    source + '/dist/css/',
    source + '/dist/js/'
  ]);
}
//SCSS - Create sourcemaps, compile and clean CSS.
function scss(task) {
  return gulp.src(paths.scss.src, { sourcemaps: true, allowEmpty: true })
    //.pipe(less())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream());
}
//CSS - Create sourcemaps, compiles and cleans CSS, then combines compiled SCSS and CSS files into 1 `styles.css` file.
function styles(task) {
  return gulp.src([paths.scss.dest + 'styles.css', paths.css.src], { sourcemaps: true, allowEmpty: true })
    .pipe(sourcemaps.init())
    .pipe(concat('styles.css'))
    .pipe(cleanCSS())
    .pipe(csso())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}
//jQuery - Loads first before all scripts as is often a dependency.
function jquery(task) {
  console.log(task);
  return gulp.src(source + '/js/jquery/*.js', { allowEmpty: true })
    //.pipe(sourcemaps.init())
    .pipe(concat('jquery.combined.js'))
    .pipe(minify({
      noSource: true,
      ext: {
          min: '.min.js'
      },
      ignoreFiles: ['-min.js','.min.js','/js/dist/*.js']
    }))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream());
}
//JS - Appends to the end of minified jQuery. Combines jQuery and JS files into 1 minified script.
function scripts(task) {
  console.log(task);
  return gulp.src([source + '/js/jquery/jquery.combined.min.js', paths.js.src], { allowEmpty: true })
    .pipe(concat('scripts.js'))
    .pipe(minify({
      noSource: true,
      ext: {
          min: '.min.js'
      },
      ignoreFiles: ['-min.js','.min.js','/js/dist/*.js']
    }))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream());
}
//What to watch for
function watch() {
  browserSync.init({
    server: true,
    open: 'external'
  });
  gulp.watch(paths.scss.src, scss);
  gulp.watch([paths.scss.dest, paths.css.src], styles);
  gulp.watch(paths.js.src, scripts);
  gulp.watch(paths.html.src).on('change', browserSync.reload);
}

//Tasks run in series or parallel using `gulp.series` and `gulp.parallel`
let build = gulp.series(clean, scss, styles, jquery, scripts, watch);

//CommonJS `exports` module notation to declare tasks
exports.clean = clean;
exports.scss = scss;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;

//Define default task that can be called by just running `gulp` from cli
exports.default = build;