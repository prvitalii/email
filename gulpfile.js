var gulp = require('gulp');
var pug = require('gulp-pug');
var stylus = require('gulp-stylus');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var del = require('del');
var sass = require('gulp-sass');

var processors = [
	autoprefixer({browsers: ['last 2 version']})
];

const ignorePug = [
	'!src/layouts/**',
	'!src/blocks/**',
	'!src/globals/**'
];

gulp.task('html', function(){
	return gulp.src(['src/**/*.pug', ...ignorePug])
		.pipe(pug())
		.pipe(gulp.dest('build'))
});


gulp.task('js', function(){
	return gulp.src(['src/assets/*.js', 
		'node_modules/bootstrap/dist/js/bootstrap.min.js', 
		'node_modules/jquery/dist/jquery.min.js', 
		'node_modules/tether/dist/js/tether.min.js'])
		.pipe(gulp.dest('build/assets'))
		.pipe(browserSync.stream());
});

gulp.task('css', function(){
	return gulp.src('src/assets/*.styl')
		.pipe(stylus())
		.pipe(postcss(processors))
		.pipe(gulp.dest('build/assets'))
		.pipe(browserSync.stream())
});

gulp.task('sass', function () {
	return gulp.src(['src/assets/**/*.sass', 
		'node_modules/bootstrap/scss/bootstrap.scss'])
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
	gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss'], gulp.series('sass'));
    gulp.watch("src/**/*.html").on('change', reload);
});

var reload = function(done){
	browserSync.reload();
	done();
}

gulp.task('watch', function() {
	gulp.watch('src/**/*.pug', gulp.series('html', reload));
	gulp.watch('src/**/*.sass', gulp.series('sass'));
	gulp.watch('src/**/*.styl', gulp.series('css'));
	gulp.watch('src/**/*.js', gulp.series('js', reload));
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

gulp.task('build', gulp.parallel('html', 'css', 'sass', 'js', 'copy'));
gulp.task('start', gulp.parallel('watch', 'serve'));

gulp.task('default', gulp.series('clean', 'build', 'start'));






