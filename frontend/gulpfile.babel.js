import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import browserSync from 'browser-sync';


const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
  return gulp.src('static/styles/**/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.', 'static']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/static/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('static/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init()) 
    .pipe($.babel())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/static/scripts'))
    .pipe(reload({stream: true}));
});

gulp.task('wiredep', () => {
  gulp.src('static/styles/**/*.scss')
    .pipe($.wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('static/styles'))

  gulp.src('templates/**/*.html')
    .pipe($.wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('templates'))
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('static/fonts/**/*'))
    .pipe(gulp.dest('.tmp/static/fonts'))
    .pipe(gulp.dest('dist/static/fonts'));
});

gulp.task('images', () => {
  return gulp.src('static/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/static/images'));
});

gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('templates/**/*.html')
    .pipe($.useref({searchPath: ['.tmp', '.tmp/static', 'static', 'templates', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.if('*.js', gulp.dest('dist')))
    .pipe($.if('*.css', gulp.dest('dist')))
    .pipe($.if('*.html', gulp.dest('dist/templates')));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}
const testLintOptions = {
  env: {
    mocha: true
  }
};

gulp.task('lint', lint('static/scripts/**/*.js'));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

gulp.task('serve', ['styles', 'scripts', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', '.tmp/static', 'templates'],
      routes: {
        '/bower_components': 'static/bower_components',
        '/static': '.tmp/static'
      }
    }
  });

  gulp.watch([
    'templates/**/*.html',
    '.tmp/static/scripts/**/*.js',
    'templates/images/**/*',
    '.tmp/static/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('static/styles/**/*.scss', ['styles']);
  gulp.watch('static/scripts/**/*.js', ['scripts']);
  gulp.watch('static/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:django', ['styles', 'scripts', 'fonts'], () => {
  browserSync({
    open: false,
    background: true,
    notify: false,
    port: 9000,
    proxy: 'localhost:8000'
  });

  gulp.watch([
    'templates/**/*.html',
    '.tmp/static/scripts/**/*.js',
    'static/images/**/*',
    '.tmp/static/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('static/styles/**/*.scss', ['styles']);
  gulp.watch('static/scripts/**/*.js', ['scripts']);
  gulp.watch('static/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/static/scripts',
        '/bower_components': 'static/bower_components',
        '/static': 'static'
      }
    }
  });

  gulp.watch('static/scripts/**/*.js', ['scripts']);
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});


gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('build', ['lint', 'images', 'fonts', 'html']);

gulp.task('default', ['clean'], () => {
  gulp.start('build')
})
