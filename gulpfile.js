// Gulp task variables
var autoprefixer =  require('gulp-autoprefixer');
var browserSync =   require('browser-sync').create();
var cssbeautify =   require('gulp-cssbeautify');
var cleanCss =      require('gulp-clean-css');
var babel =         require('gulp-babel');
var del =           require('del');
var gulp =          require('gulp');
var concat =        require('gulp-concat');
var postcss =       require('gulp-postcss');
var plumber =       require('gulp-plumber');
var sass =          require('gulp-sass')(require('sass'));
var sourcemaps =    require('gulp-sourcemaps');
var uglify =        require('gulp-uglify');
var rename =        require('gulp-rename');
var wait =          require('gulp-wait');

// Path variables
var PATHS = {
    DIST: {
        BASE: './dist',
        ASSETS: './dist/assets',
        IMAGES: './dist/assets/img',
        VENDOR: './dist/assets/vendor'
    },
    BASE: {
        BASE: './',
        NODE: './node_modules'
    },
    SRC: {
        BASE: './',
        SCSS: './src/scss',
        HTML: './**/*.html',
        PAGES: './pages',
        DOCS: './docs',
        JS: [
            './node_modules/bluebird/js/browser/bluebird.min.js',
            './src/js/**/*.js'
        ],
    },
    ASSETS: {
        BASE: './assets',
        CSS: './assets/css',
        JS: './assets/js',
        VENDOR: './assets/vendor',
        IMAGES: './assets/img/**/*.+(png|jpg|svg|gif)'
    }
}

// Clean directories
gulp.task('clean:dist', function() {
    return del([
        PATHS.DIST.BASE
    ]);
});


// BrowserSync init
function browserSyncInit(done) {
	browserSync.init({
        host: 'localhost',
        port: 3000,
        proxy: false,
		server: {
            baseDir: PATHS.SRC.BASE
        },
        startPath: 'pages/index.html'
	});
	done();
}

// BrowserSync callback
function browserSyncReload(done) {
	browserSync.reload();
	done();
}

// Watch for changes
function watch() {
    gulp.watch(PATHS.SRC.SCSS + '/**/*.scss', gulp.series('scss'));
    gulp.watch(PATHS.SRC.JS, gulp.series('js'));
    gulp.watch(PATHS.SRC.HTML, browserSyncReload);
};

// Compile SCSS
gulp.task('scss', function() {
    return gulp.src(PATHS.SRC.SCSS + '/theme.scss')
        .pipe(wait(500))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            require('postcss-flexbugs-fixes')
        ]))
        .pipe(cssbeautify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(PATHS.ASSETS.CSS))
        .pipe(browserSync.reload({
            stream: true
        }));
});
  
// Minify CSS
gulp.task('minify:css', function() {
    return gulp.src(PATHS.ASSETS.CSS + '/theme.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCss())
        //.pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(PATHS.DIST.BASE + '/assets/css'))
});

// Process JS file and return the stream
gulp.task('js', function () {
    return gulp.src(PATHS.SRC.JS)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('theme.js'))
        .pipe(gulp.dest(PATHS.ASSETS.JS))
        .pipe(browserSync.reload({
            stream: true
        }));
});
  
// Minify JS
gulp.task('minify:js', function() {
    return gulp.src(PATHS.ASSETS.JS + '/theme.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        //.pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(PATHS.DIST.BASE + '/assets/js'))
});

// Copy HTML
gulp.task('copy:html', function() {
    return gulp.src(PATHS.SRC.PAGES + '/*')
        .pipe(gulp.dest(PATHS.DIST.BASE + '/pages'))
});

// Copy Docs
gulp.task('copy:docs', function() {
    return gulp.src(PATHS.SRC.DOCS + '/*')
        .pipe(gulp.dest(PATHS.DIST.BASE + '/docs'))
});

// Copy plugins
gulp.task('copy:plugins', function(done) {
    return gulp
        .src([
            PATHS.BASE.NODE + '/@fancyapps*/**/*',
            PATHS.BASE.NODE + '/@fortawesome*/**/*',
            PATHS.BASE.NODE + '/aos*/**/*',
            PATHS.BASE.NODE + '/bootstrap*/**/*',
            PATHS.BASE.NODE + '/imagesloaded*/**/*',
            PATHS.BASE.NODE + '/isotope-layout*/**/*',
            PATHS.BASE.NODE + '/isotope-packery*/**/*',
            PATHS.BASE.NODE + '/jquery*/**/*',
            PATHS.BASE.NODE + '/jquery-conutdown*/**/*',
            PATHS.BASE.NODE + '/jquery.mb.vimeo_player*/**/*',
            PATHS.BASE.NODE + '/jquery.mb.ytplayer*/**/*',
            PATHS.BASE.NODE + '/material-design-iconic-font*/**/*',
            PATHS.BASE.NODE + '/owl.carousel*/**/*',
            PATHS.BASE.NODE + '/popper.js*/**/*',
            PATHS.BASE.NODE + '/prismjs*/**/*',
            PATHS.BASE.NODE + '/rellax*/**/*',
            PATHS.BASE.NODE + '/sticky-kit*/**/*',
            PATHS.BASE.NODE + '/typed.js*/**/*',
        ])
        .pipe(gulp.dest(PATHS.ASSETS.VENDOR))
    done();
});

// Copy assets
gulp.task('copy:assets', function() {
    return gulp.src(PATHS.ASSETS.BASE + '/**/*')
        .pipe(gulp.dest(PATHS.DIST.ASSETS));
});

// Live sever
gulp.task('browserSync', gulp.series(browserSyncInit, watch));

// Default, development mode
gulp.task('default', gulp.series('copy:plugins', 'scss', 'browserSync'));

// Production mode
gulp.task('build', gulp.series('clean:dist', 'copy:plugins', 'copy:html', 'copy:assets', 'scss', 'minify:css', 'minify:js'));

// Production mode with docs
gulp.task('build-with-docs', gulp.series('clean:dist', 'copy:plugins', 'copy:html', 'copy:docs', 'copy:assets', 'scss', 'minify:css', 'minify:js'));