var gulp = require('gulp'),                           //基础库
    //sass = require('gulp-ruby-sass'),               //sass编译
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),           //css压缩
    jshint = require('gulp-jshint'),                  //js检查
    uglify = require('gulp-uglify'),                  //js压缩
    imagemin = require('gulp-imagemin'),              //图片压缩
    rename = require('gulp-rename'),                  //重命名
    concat = require('gulp-concat'),                  //合并文件
    clean = require('gulp-clean'),                    //清空文件夹
    notify = require('gulp-notify'),                  //更动通知
    cache = require('gulp-cache'),                    //图片快取,只有更改过得图片会进行压缩
    tinylr = require('tiny-lr'),                      //同步livereload
    server = tinylr(),
    port = 35729,
    livereload = require('gulp-livereload');          //同步livereload

//config统一路径配置
var paths = {
    //templates: ['templates/**/*.html'],
    js : ["static/js/*.js", "!static/js/*.min.js"],
    css : ['static/css/*.css', '!static/css/*.min.css'],
    images : ['static/images/*']
};

// html处理
gulp.task('html', function() {
    var htmlSrc = './src/*.html',
        htmlDst = './build/';

    gulp.src(htmlSrc)
        .pipe(livereload(server))
        .pipe(gulp.dest(htmlDst))
});

//css 处理
gulp.task('css', function() {
  return gulp.src(paths.css)
    //添加前缀
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    //保存未压缩文件到我们指定的目录下面
    .pipe(gulp.dest('dist/assets/css'))
    //给文件添加.min后缀
    .pipe(rename({suffix: '.min'}))
    //压缩样式文件
    .pipe(minifycss())
    //输出压缩文件到指定目录
    .pipe(gulp.dest('dist/assets/css'))
    //提醒任务完成
    .pipe(notify({ message: 'Css task complete' }));
});

/*css-less处理
gulp.task('styles', function() {
  return gulp.src('static/css/*.less')
    .pipe(less({ style: 'expanded' }))
    //全部前缀
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});
*/

/*js处理
  是否需要合并 追加到jshint下
  .pipe(concat('main.js'))
*/
gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: 'Js task complete' }));
});

/*images处理
  只有新的或更动的图片会被压缩
  .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
*/
gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

//清空images、css、js
gulp.task('clean', function() {
  return gulp.src(['dist/assets/css','dist/assets/js', 'build/images'], {read: false})
    .pipe(clean());
});

/*
gulp.task('dev', function () {
  var lr = tinylr();
  lr.listen(port);
  gulp.watch(['**.{js,css,html}'], function (evt) {
    lr.changed({
      body: {
        files: [evt.path]
      }
    });
  });
});
*/

// 默认任务 清空images、css、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function() {
    gulp.start('css', 'js', 'images');
});

//监听任务 运行语句 gulp watch
gulp.task('watch', function() {

  /* 监听html
  gulp.watch('./template/*.html', function(event){
      gulp.run('html');
  })
  */

  // 监听所有.css
  gulp.watch(paths.css, ['css']);

  // 监听所有.js
  gulp.watch(paths.js, ['js']);

  // 监听所有images
  gulp.watch(paths.images, ['images']);

  // 监听 static/ 目录下的文件, 实时重整
  var server = livereload();

  gulp.watch(['static/**']).on('change', function(file) {
    server.changed(file.path);
  });

});
