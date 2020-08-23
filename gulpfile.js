const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
let concat = require('gulp-concat')
let pug = require('gulp-pug')

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
    .pipe(gulp.dest('./public/js'))
    .pipe(browserSync.stream())

const css = () => gulp.src('src/views/sass/*.sass')
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream())

const html = () => gulp.src('src/views/pug/*.pug')
    .pipe(pug(pugConfig))
    .pipe(gulp.dest('public'))
    .pipe(browserSync.stream())


gulp.task('watch', 
    gulp.series(
        gulp.parallel(server, html, css, scripts),
        () => {
            gulp.watch('src/views/pug/**/*.pug', html)
            gulp.watch('src/views/sass/**/*.sass', css)
            gulp.watch('src/js/**/*.js', scripts)
        }
    )
)