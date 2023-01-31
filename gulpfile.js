import gulp from "gulp";
import * as nodePath from "path";
import {deleteAsync} from "del";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import autoprefixer from "gulp-autoprefixer";

const buildFolder = './dist';
const srcFolder = './src';
const rootFolder = nodePath.basename(nodePath.resolve());
const sass = gulpSass(dartSass);

const path = {
  build: {
    images: `${buildFolder}/images/`,
    css: `${buildFolder}/css/`,
    html: `${buildFolder}/`,
    files: `${buildFolder}/vendor/`,
  },
  src: {
    images: `${srcFolder}/images/**/*.*`,
    scss: `${srcFolder}/sass/style.scss`,
    html: `${srcFolder}/*.html`,
    files: `${srcFolder}/vendor/*.*`,
  },
  watch: {
    images: `${srcFolder}/images/**/*.*`,
    scss: `${srcFolder}/sass/**/*.scss`,
    html: `${srcFolder}/**/*.html`,
    files: `${srcFolder}/vendor/*.*`,
  },
  clean: buildFolder,
  buildFolder: buildFolder,
  srcFolder: srcFolder,
  rootFolder: rootFolder
}

//функции
const copy = () => {
  return gulp.src(path.src.files)
    .pipe(gulp.dest(path.build.files));
}
const html = () => {
  return gulp.src(path.src.html)
    .pipe(gulp.dest(path.build.html));
}

const scss = () => {
  return gulp.src(path.src.scss, {sourcemaps: true})
  .pipe(sourcemaps.init())
  .pipe(sass({
      outputStyle: 'expanded'
    }))
  .pipe(autoprefixer())
  .pipe(sourcemaps.write("."))
  .pipe(gulp.dest(path.build.css));
}

const images = () => {
  return gulp.src(path.src.images)
    .pipe(gulp.dest(path.build.images));
}

const copyAll = gulp.parallel(copy, html,scss, images)

const reset = () => {
  return deleteAsync ([buildFolder]);
}
function watcher () {
  gulp.watch(path.watch.files, copy);
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.images, images);
}


//сценарий сборки проекта
const dev = gulp.series(reset, copyAll, watcher);

//выполнение задач
gulp.task('default', dev);
