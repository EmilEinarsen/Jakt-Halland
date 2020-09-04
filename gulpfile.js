const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const concat = require('gulp-concat')
const pug = require('gulp-pug')
const cleanCSS = require('gulp-clean-css')
const htmlmin = require('gulp-htmlmin')
const minify = require('gulp-minify')

const serverConfig = {
    server: {
        baseDir: './public'
    },
    port        : 8000,
    open        : false,
}
const pugConfig = {
    doctype: 'html',
    pretty: false,
}

const server = done => {
    browserSync.init(serverConfig)
    done()
}
const scripts = () => gulp.src('./src/js/**/*.js')
    .pipe(concat('main.js'))
    .pipe(minify())
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.stream())

const styles = () => gulp.src('src/views/sass/*.sass')
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(gulp.dest('public'))
    .pipe(browserSync.stream())

const pages = () => gulp.src('src/views/pug/*.pug')
    .pipe(pug(pugConfig))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('public'))
    .pipe(browserSync.stream())

gulp.task('watch', 
    gulp.series(
        gulp.parallel(server, pages, styles, scripts),
        () => {
            gulp.watch('src/views/pug/**/*.pug', pages)
            gulp.watch('src/views/sass/**/*.sass', styles)
            gulp.watch('src/js/**/*.js', scripts)
        }
    )
)