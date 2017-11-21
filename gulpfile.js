'use strict';

var gulp = require('gulp'),
    //load plugins starting with gulp- on demand
    req = require('gulp-load-plugins')({
      rename: {
        'gulp-angular-templatecache': 'templatecache',
        'gulp-ng-annotate' : 'annotate',
        'gulp-scss-lint' : 'scssLint'
      }
    }),
    //plugins that doesnt start with "gulp-"
    server = require('browser-sync'),
    del = require('del'),
    arg = require('yargs').argv,
    path = require('path'),
    modRewrite  = require('connect-modrewrite');

// Paths
const devroot = 'src/';
const paths = {
  dist: './docs/',
  scripts: [devroot+'app/**/*.js'],
  styles: [devroot+'assets/sass/**/*.scss', '!'+devroot+'assets/sass/lib/*.scss'],
  templates: devroot+'app/**/*.html',
  modules: [
    'jquery/jquery.js',
    'angular/angular.js',
    '@uirouter/angularjs/release/angular-ui-router.js'
  ],
  statics: [
    devroot+'*.html'
  ]
}


server.create();

/* clear dist folder */
gulp.task('clean', function(cb) {
    del(paths.dist + '**/*',  cb);
});

/* Concatenate and cache all templates*/
gulp.task('templates', function() {
  return gulp.src(paths.templates)
    .pipe(req.htmlmin({ collapseWhitespace: true }))
    .pipe(req.templatecache({
      root: 'app',
      standalone: true,
      transformUrl: function (url) {
        return url.replace(path.dirname(url), '.');
      }
    }))
    .pipe(gulp.dest(paths.dist + 'js/'));
});

/* Create the vendor file */
gulp.task('modules', ['templates'], function() {
  console.log('here in modules')
    return gulp.src(paths.modules.map(function(item){
      return 'node_modules/' + item;
    }))
    .pipe(req.concat('vendor.js'))
    .pipe(req.if(arg.deploy, req.uglify()))
    .pipe(gulp.dest(paths.dist + 'js/'));
});


var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'nested'
};
/* Create the css file */
gulp.task('styles', function(){
  console.log('here in style')
  return gulp.src(paths.styles)
    .pipe(req.sourcemaps.init())
    .pipe(req.sass(sassOptions).on('error', req.sass.logError))
    .pipe(req.autoprefixer(autoprefixerOptions))
    .pipe(req.sourcemaps.write())
    .pipe(gulp.dest(paths.dist + 'css/'));
});

/* Create the bundle with all app js */
gulp.task('scripts', ['modules'], function(){
  console.log('here in scripts')
  return gulp.src([
      devroot+'app/**/*.module.js',
      devroot+'app/**/*.js',
      './templates.js'
    ])
    .pipe(req.wrap('(function(angular){\n\'use strict\';\n<%= contents %>})(window.angular);'))
    .pipe(req.concat('bundle.js'))
    .pipe(req.annotate())
    .pipe(req.if(arg.deploy, req.uglify()))
    .pipe(gulp.dest(paths.dist + 'js/'));
});

/* start server */
gulp.task('serve', function(){
  return server.init({
    files: [devroot+'/**'],
    port: 3000,
    server: {
      baseDir: paths.dist,
      middleware: [
          modRewrite([
              '!\\.\\w+$ /index.html [L]'
          ])
      ]
    }
  });

});

/* Clear dist and copy index.html over */
gulp.task('copy', function(){
  return gulp.src(paths.statics, { base: 'src' })
    .pipe(gulp.dest(paths.dist));
});

/* watch dev script, styles and templates, on change update dist files */
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.templates, ['templates']);
  gulp.watch(paths.styles, ['styles']);
});


/* This task runs with npm start (check package.json) */
gulp.task('default', [
  'copy',
  'styles',
  'serve',
  'scripts',
  'watch'
]);


/* production task with minification */
gulp.task('production', [
  'copy',
  'styles',
  'scripts'
]);

