//--Gulp.js V4--//
const devUrlWithPort = '';
const fs = require('fs');
const root = __dirname;
const source = root + '/public';
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const csso = require('gulp-csso');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync	= require('browser-sync');
const os = require('os');
const interfaces = os.networkInterfaces();
const serverIP = interfaces.wlan0[0].address;

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
  jQuery: {
    src: source + '/js/jquery/*.js',
    dest: source + '/js/jquery/combined/'
  },
  js: {
    src: source + '/js/*.js',
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
async function clean() {
  let cssFolder = source + '/dist/css/';
  let jsFolder = source + '/dist/js/';

  clearDirectories(cssFolder);
  clearDirectories(jsFolder);

}

function clearDirectories(folder) {

  fs.readdir(folder, (err, files) => {
    if (err) throw err;
    
    for (const file of files) {
        console.log(file + ' : File Deleted Successfully.');
        fs.unlinkSync(folder+file);
    }
  });
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
    // .pipe(cleanCSS())
    // .pipe(csso())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}
//jQuery - Loads first before all scripts as is often a dependency.
function jquery(task) {
  console.log(task);
  return gulp.src(paths.jQuery.src)
    .pipe(sourcemaps.init())
    .pipe(concat('jquery.combined.js'))
    .pipe(minify({
      noSource: true,
      ext: {
          min: '.min.js'
      },
      ignoreFiles: ['-min.js','.min.js','/js/dist/*.js']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.jQuery.dest))
    .pipe(browserSync.stream());
}
//JS - Appends to the end of minified jQuery. Combines jQuery and JS files into 1 minified script.
function scripts(task) {
  console.log(task);
  return gulp.src([source + '/js/init.js', source + '/js/app.js'])
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.init())
    .pipe(minify({
      ext: {
          min: '.min.js'
      },
      ignoreFiles: ['-min.js','.min.js','/js/dist/*.js']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream());
}

//What to watch for
function watch(done) {
  browserSync.init({
    //server: true,
    open: 'external',
    host: serverIP,
    port: 8000,
    proxy: 'http://' + serverIP + ':8000'
  });
  gulp.watch(paths.scss.src, scss);
  gulp.watch([paths.scss.dest, paths.css.src], styles);
  gulp.watch(paths.js.src, scripts);
  gulp.watch(paths.html.src).on('change', browserSync.reload);
  done();
}

function serve(done) {
  nodemon({
    script: 'index.js',
    //ext: 'js',
    env: {
      NODE_ENV: 'dev',
      PORT: 8000
    },
    ignore: [
      './node_modules/**',
      './public/**'
    ],
    done: done
  });
  done();
}

//Tasks run in series or parallel using `gulp.series` and `gulp.parallel`
let build = gulp.series(serve, clean, scss, styles, scripts, watch);


//CommonJS `exports` module notation to declare tasks
exports.clean = clean;
exports.scss = scss;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.serve = serve;
exports.build = build;

//Define default task that can be called by just running `gulp` from cli
exports.default = build;