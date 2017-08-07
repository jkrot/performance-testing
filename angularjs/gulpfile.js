/**
 * Gulp Packages
 */

// General
var gulp = require('gulp');
var debug = require('gulp-debug');
var gutil = require('gulp-util');
var fs = require('fs');
var st = require('st');
var del = require('del');
var lazypipe = require('lazypipe');
var plumber = require('gulp-plumber');
var flatten = require('gulp-flatten');
var tap = require('gulp-tap');
var rename = require('gulp-rename');
var header = require('gulp-header');
var footer = require('gulp-footer');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var http = require('http');
var package = require('./package.json');

// Scripts and tests
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var path = require('path');
var karma = require('karma')
var karmaParseConfig = require('karma/lib/config').parseConfig;
var sourcemaps = require('gulp-sourcemaps');
var templateCache = require('gulp-angular-templatecache');

// Styles
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var cssBase64 = require('gulp-css-base64');
var csslint = require('gulp-csslint');

// Docs
var markdown = require('gulp-markdown');
var fileinclude = require('gulp-file-include');
var conventionalChangelog = require('gulp-conventional-changelog');



/**
 * Paths to project folders
 */

var paths = {
    input: 'app/**/*',
    output: 'dist/',
    scripts: {
        input: 'app/js/*.js',
        output: 'dist/script/'
    },
    resource: {
        input: [     
                    'node_modules/angular/angular.js',
                    'node_modules/angular-resource/angular-resource.js',
                    'node_modules/angular-route/angular-route.js',
                    'node_modules/angular-qrcode/angular-qrcode.js',
                    'node_modules/qrcode-generator/js/qrcode.js',
                    'node_modules/angular-sanitize/angular-sanitize.js',
                    'node_modules/dicom-parser/dist/dicomParser.js'],
        output: 'dist/script/',
    },
    js: {
        input: [    
                    'app/js/main.js', 
                    'app/js/fileCtrl.js'],
        output: 'dist/script/'
    },
    test: {
        input: 'app/js/**/*.js',
        karma: 'test/karma.conf.js',
        spec: 'test/spec/*.js',
        coverage: 'test/coverage/',
        results: 'test/results/'
    },
    css: {
        input:  'app/css/*.css',
        output: 'dist/css'
    },
    filesToMove: {
        dev: [
            'app/*.html'],
        prod:  [
            'app/*.html']
    }
};

// Karma Function
function runKarma(configFilePath, options, cb) {

    configFilePath = path.resolve(configFilePath);

    var server = karma.Server;
    var log=gutil.log, colors=gutil.colors;
    var config = karmaParseConfig(configFilePath, {});

    Object.keys(options).forEach(function(key) {
      config[key] = options[key];
    });

    server.start(config, function(exitCode) {
        log('Karma has exited with ' + colors.red(exitCode));
        cb();
        process.exit(exitCode);
    });
}

/**
 * Gulp Taks
 */

// Lint, minify, and concatenate scripts only from the js folder, anything is scipt is just copied

gulp.task('build:resource', ['clean:dist'], function() {
    var jsResourceTasks = lazypipe()
        .pipe(concat, 'resource.js')
        .pipe(uglify)
        .pipe(gulp.dest, paths.resource.output);

    return gulp.src(paths.resource.input)
        .pipe(plumber())
        .pipe(jsResourceTasks())
        .pipe(livereload());
});

gulp.task('build:scripts:dev', ['clean:dist','build:copy:dev'], function() {
    var jsDevTasks = lazypipe()
        .pipe(sourcemaps.init)
        .pipe(concat, 'main.js')
        .pipe(uglify)
        .pipe(sourcemaps.write)
        .pipe(gulp.dest, paths.scripts.output);

    return gulp.src(paths.js.input)
        .pipe(plumber())
        .pipe(jsDevTasks())
        .pipe(livereload());
});

gulp.task('build:scripts:prod', ['clean:dist','build:copy:prod'], function() {
    var jsProdTasks = lazypipe()
        .pipe(concat, 'main.js')
        .pipe(uglify)
        .pipe(gulp.dest, paths.scripts.output);

    return gulp.src(paths.js.input)
        .pipe(plumber())
        .pipe(jsProdTasks());
});

gulp.task('build:css:dev', ['clean:dist','build:copy:dev'], function() {
  return gulp.src(paths.css.input)
    .pipe(sourcemaps.init())
    .pipe(concat('wits.css'))
    .pipe(cssBase64())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.css.output));
});

gulp.task('build:css:prod', ['clean:dist','build:copy:prod'], function() {
  return gulp.src(paths.css.input)
    .pipe(concat('wits.css'))
    .pipe(cssBase64())
    .pipe(gulp.dest(paths.css.output));
});

// Lint scripts
gulp.task('lint:scripts', function () {
    return gulp.src(paths.scripts.input)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint:css', function() {
  gulp.src(paths.css.input)
    .pipe(csslint({
        'duplicate-properties': false,
        'floats': false,
        'overqualified-elements': false,
        'adjoining-classes': false,
        'important': false,
        'floats': false,
        'universal-selector': false,
        'ids': false,
        'box-model': false,
        'box-sizing': false,
        'compatible-vendor-prefixes': false,
        'outline-none': false
      }))
    .pipe(csslint.reporter());
});

// Remove pre-existing content from output and test folders
gulp.task('clean:dist', function () {
    del.sync([
        paths.output
    ]);
});

// Remove pre-existing content from text folders
gulp.task('clean:test', function () {
    del.sync([
        paths.test.coverage,
        paths.test.results
    ]);
});

gulp.task('build:copy:dev', ['clean:dist'], function(){
    gulp.src(paths.filesToMove.dev, { base: './app' })
    .pipe(gulp.dest('dist'));
});

gulp.task('build:copy:prod', ['clean:dist'], function(){
    gulp.src(paths.filesToMove.prod, { base: './app' })
    .pipe(gulp.dest('dist'));
});

// Watchers 
gulp.task('watch', ['clean:dist','build:copy:dev','build:scripts:dev'], function() {
    livereload.listen({ basePath: './app' });
    $log.info('Rebuilding Scripts');
    gulp.watch('./app/js/*.js', ['build:scripts']);
});

// Server to Manually do things with
gulp.task('server', function(done) {
  http.createServer(
    st({ path: __dirname + '/dist', index: 'index.html', cache: false })
  ).listen(8081, done);
});


// Run unit tests
/** single run */
gulp.task('test:single', ['build:scripts:prod', 'build:css:prod', 'build:copy:prod', 'clean:dist', 'clean:test'], function(cb) {
    runKarma( paths.test.karma , {
        autoWatch: false,
        singleRun: true
    }, cb);
});

/** continuous ... using karma to watch since ran into problem with gulp watchers */
gulp.task('test:continuous', ['build:scripts:dev', 'build:css:dev','build:copy:dev', 'clean:dist', 'clean:test', 'server'], function(cb) {
    runKarma( paths.test.karma , {
        autoWatch: true,
        singleRun: false
    }, cb);
});


gulp.task('changelog', function () {
  return gulp.src('CHANGELOG.md', {
    buffer: false
  })
    .pipe(conventionalChangelog({
        preset: 'angular'
    }))
    .pipe(gulp.dest('./'));
});


/**
 * Task Runners
 */

gulp.task('preprocess' , [
    'lint:scripts',
    'clean:dist',
    'clean:test',
    'build:resource'
]);

// Compile files and continuous unit tests
gulp.task('default', [
    'preprocess',
    'build:copy:prod',
    'build:scripts:prod',
    'build:css:prod',
    'test:single'
]);

// Run unit tests once
gulp.task('test', [
    'preprocess',
    'lint:css',
    'build:copy:dev',
    'build:scripts:dev',
    'build:css:dev',
    'server',
    'test:continuous'
]);
