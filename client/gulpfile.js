var gulp = require('gulp');
var gutil = require("gulp-util");
var concat = require('gulp-concat');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var watchify = require("watchify");
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['src/html/*.html']
};

gulp.task('copyHtml', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

gulp.task('vendor', function() {
    return gulp.src('node_modules/phaser/build/phaser.js')
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./dist/'));
});

/*gulp.task('vendor', function(){
    return browserify({
	basedir: '.',
	entries: [
	    'node_modules/phaser/build/phaser.js'
	]
    })
	.bundle()
	.pipe(source('vendor.js'))
        .pipe(buffer())
	.pipe(gulp.dest('dist'));
});*/

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/typescript/main.ts'],
    cache: {},
    packageCache: {}
    }).plugin(tsify));

function bundle() {
    return watchedBrowserify.transform("babelify")
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
}

gulp.task('default', ['copyHtml'], bundle);

watchedBrowserify.on('update', bundle);
watchedBrowserify.on('log', gutil.log);
