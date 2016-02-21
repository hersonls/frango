import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';


const $ = gulpLoadPlugins();

gulp.task('styles', function() {
  return gulp.src('static/styles/**/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      'outputStyle': 'expanded',
      'precision': 10,
      'includePaths': ['.']
    }).on('error', $.sass.logError))
    .pipe($.sourcemaps.write())
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'));
})

gulp.task('default', ['styles']);
