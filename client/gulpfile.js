var gulp = require('gulp');
var concat = require('gulp-concat');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
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

gulp.task('ts-compile', function() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/typescript/main.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .transform("babelify")
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['copyHtml', 'ts-compile']);
