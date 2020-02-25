const gulp = require('gulp'),
    { series, parallel } = require('gulp'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    saveLicense = require('uglify-save-license'),
    browserSync = require('browser-sync'),
    gulpClean = require('gulp-clean'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber');


const clean = function () {
    return gulp.src('build')
        .pipe(gulpClean({force: true}));
};

const cssStyle = function () {
    return gulp.src(['src/scss/**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('../_maps/'))
        .pipe(gulp.dest('build/css/'))
        .pipe(browserSync.reload({
            stream: true
        }));
};

const browser_sync = function() {

    browserSync.init({
        server: {
            baseDir: "build/",
            open:true,
        }
    });

    gulp.watch(['src/scss/**/*.scss'], cssStyle);
    gulp.watch(["src/img/**/*.png", "src/img/**/*.jpg", "src/img/**/*.svg"], images);
    gulp.watch(["src/js/**/*.js"], scripts);
    gulp.watch(["src/*.html"], html);
    gulp.watch(["src/*.htaccess"], htaccess);

};

const scripts = function() {
    return gulp.src(['src/js/**/*.js'])
        .pipe(uglify({
            output: {
                comments: saveLicense
            }
        }))
        .pipe(concat('script.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
};

const html = function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.reload({
            stream: true
        }))
};

const htaccess = function() {
    return gulp.src('src/.htaccess')
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.reload({
            stream: true
        }))
};

const images = function () {
    return gulp.src('src/img/**/*')
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest('build/img'))
};



exports.default = series(browser_sync);
exports.build = series(clean, parallel(images, cssStyle, scripts, html, htaccess));