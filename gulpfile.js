var gulp = require('gulp');
var pug = require('gulp-pug');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var del = require('del');
var sass = require('gulp-sass');
var sassTr = require('jstransformer')(require('jstransformer-sass'));
var stylusTr = require('jstransformer')(require('jstransformer-stylus'))
 
// sassTr.render('h1\n  color: red').body

// var css = "fonts = helvetica, arial, sans-serif\
// body {\
//   padding: 50px;\
//   font: 14px/1.4 fonts;\
// }"
// stylus.render(css).body

var processors = [
	autoprefixer({browsers: ['last 2 version']})
];

gulp.task('html', function(){
	return gulp.src('src/**/*.pug')
		.pipe(pug())
		.pipe(gulp.dest('build'))
});

gulp.task('sass', function () {
	return gulp.src('src/assets/**/*.sass')
	    .pipe(sass())
		.pipe(postcss(processors))
	    .pipe(gulp.dest('build/assets'))
		.pipe(browserSync.stream())
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});

var reload = function(done){
	browserSync.reload();
	done();
}

gulp.task('watch', function() {
	gulp.watch('src/**/*.pug', gulp.series('html', reload));
	gulp.watch('src/**/*.sass', gulp.series('sass'));
});

gulp.task('copy', function(){
	return gulp.src([
			'src/assets/**/*.{jpg,png,jpeg,svg,gif}'
		])
	.pipe(gulp.dest('build/assets'))
});

gulp.task('clean', function() {
	return del('build');
});

gulp.task('build', gulp.parallel('html', 'sass', 'copy'));
gulp.task('start', gulp.parallel('watch', 'serve'));

gulp.task('default', gulp.series('clean', 'build', 'start'));