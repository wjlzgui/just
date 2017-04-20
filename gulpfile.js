'use strict';

var app={
	srcPath:'src/',
	devPath:'bulid/',
	proPath:'dist/'
}

var proName="itany";

var gulp=require('gulp');
var $=require('gulp-load-plugins')();
var browserSync=require('browser-sync').create();

gulp.task('html',function(){
	gulp.src(app.srcPath+'**/*.html')
		.pipe($.plumber())
		.pipe(gulp.dest(app.devPath))
		.pipe($.htmlmin({
			collapseWhitespace:true,//去除HTML中的空白区域
			removeComments:true,//删除html中的注释
			collapseBooleanAttributes:true,//删除html 中 boolean 类型的属性值
			removeEmptyAttributes:true,//删除html 标签中的 空属性  值为“”
			removeScriptTypeAttributes:true,//删除Script 标签的type属性
			removeStyleLinkTypeAttributes:true
		}))
		.pipe(gulp.dest(app.proPath))
		.pipe(browserSync.stream());
});


gulp.task('less',function(){
	gulp.src(app.srcPath+'less/**/*.less')
			.pipe($.plumber())
			.pipe($.less())
			//为css属性添加浏览器匹配前缀
			// 指定添加规则
			.pipe($.autoprefixer({
				browsers:['last 20 versions'],//是css属性兼容主流浏览器的最新的20个版本
				cascode:false //是否美化属性值，默认是true
			}))
			.pipe(gulp.dest(app.devPath+'css'))
			.pipe(gulp.dest(app.proPath+'css'))
			//.pipe(browserSync.stream())//浏览器的同步
			.pipe($.cssmin())
			//gulp-rename 对写入文件进行重新命名
			.pipe($.rename({
				suffix: ".min",
    		extname: ".css"
			}))
			.pipe(gulp.dest(app.proPath+'css'));
			
});

gulp.task('js',function(){
	gulp.src(app.srcPath+'js/**/*.js')
		.pipe($.plumber())
		.pipe($.concat(proName+'.js'))
		.pipe(gulp.dest(app.devPath+'js'))
		.pipe(gulp.dest(app.proPath+'js'))
		.pipe($.uglify())
		.pipe($.rename({
			suffix:".min",
			extname:".js"
		}))
		.pipe(gulp.dest(app.proPath+'js'))
		.pipe(browserSync.stream());
});

gulp.task('watch',function(){
	gulp.watch(app.srcPath+'**/*.html',['html']);
	gulp.watch(app.srcPath+'less/**/*.less',['less']);
	gulp.watch(app.srcPath+'js/**/*.js',['js']);
});

gulp.task('clean',function(){
	gulp.src([app.devPath,app.proPath])
			.pipe($.clean());
});

gulp.task('default',['html','less','js','watch'],function(){
	browserSync.init({
		server:{
			baseDir:app.devPath
		}
	})
	gulp.watch(app.devPath+"css/**/*.css").on("change",browserSync.reload);
});


