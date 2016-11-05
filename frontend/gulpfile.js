const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const cache = require('gulp-cache');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const merge = require('merge-stream');
const spritesmith = require('gulp.spritesmith');
const csso = require('gulp-csso');
const browserSync = require('browser-sync');
const plumber = require('gulp-plumber');
const path = require('path');

const staticFilePath = {
  htmlSrc: path.join('view', '*.pug'),
  htmlDst: path.join('..', 'static'),
  cssSrc: path.join('scss', '*.scss'),
  cssDst: path.join('..', 'static', 'css'),
  jsSrc: path.join('js', '*.js'),
  jsDst: path.join('..', 'static', 'js'),
  imgSrc: path.join('image', '*.*'),
  imgDst: path.join('..', 'static', 'image'),
};

gulp.task('html', () => gulp.src(staticFilePath.htmlSrc)
        .pipe(plumber())
        .pipe(pug())
        .pipe(gulp.dest(staticFilePath.htmlDst))
        .pipe(browserSync.stream())
);

gulp.task('styles', () => gulp.src(staticFilePath.cssSrc)
        .pipe(plumber())
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(staticFilePath.cssDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(staticFilePath.cssDst))
        .pipe(browserSync.stream())
);

gulp.task('scripts', () => gulp.src(staticFilePath.jsSrc)
      .pipe(plumber())
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .pipe(gulp.dest(staticFilePath.jsDst))
      .pipe(browserSync.stream())
);

gulp.task('sprite', () => {
  // // Generate our spritesheet
  // const spriteData = gulp.src(staticFilePath.imgSrc).pipe(spritesmith({
  //   imgName: 'sprite.png',
  //   cssName: 'sprite.css',
  // }));

  // // Pipe image stream through image optimizer and onto disk
  // const imgStream = spriteData.img
  //   // DEV: We must buffer our stream into a Buffer for `imagemin`
  //   .pipe(buffer())
  //   .pipe(imagemin())
  //   .pipe(gulp.dest(staticFilePath.cssDst));

  // // Pipe CSS stream through CSS optimizer and onto disk
  // const cssStream = spriteData.css
  //   .pipe(csso())
  //   .pipe(gulp.dest(staticFilePath.cssDst));

  // // Return a merged stream to handle both `end` events
  // return merge(imgStream, cssStream);

  return gulp.src(staticFilePath.imgSrc)
        .pipe(plumber())
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest(staticFilePath.imgDst))
        .pipe(browserSync.stream());
});

gulp.task('sync', () =>
  browserSync.init({
    server: {
      baseDir: path.join('..', 'static'),
    },
    browser: 'google chrome',
    open: 'external',
  })
);

gulp.task('default', ['sync', 'watch'], () => gulp.start('html', 'styles', 'scripts', 'sprite'));

gulp.task('watch', () => {
  gulp.watch(staticFilePath.htmlSrc, ['html']);
  gulp.watch(staticFilePath.cssSrc, ['styles']);
  gulp.watch(staticFilePath.jsSrc, ['scripts']);
  gulp.watch(staticFilePath.imgSrc, ['sprite']);
});
