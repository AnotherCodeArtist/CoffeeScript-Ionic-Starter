var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var coffee = require('gulp-coffee');
var Server = require('karma').Server;
var ngAnnotate = require('gulp-ng-annotate');
var inject = require('gulp-inject');
var clean = require('gulp-clean');
var gulpif = require('gulp-if');

var paths = {
    sass: ['./www/**/*.scss'],
    coffee: ['./www/**/*.coffee'],
    js: ['./www/js/**/*.js'],
    libs: ['./www/lib/angular/angular.js',
        './www/lib/angular-cookies/angular-cookies.js',
        './www/lib/angular-jwt/dist/angular-jwt.js',
        './www/lib/angular-resource/angular-resource.js',
        './www/lib/angular-animate/angular-animate.js',
        './www/lib/angular-sanitize/angular-sanitize.js',
        './www/lib/angular-jwt/dist/angular-jwt.js',
        './www/lib/leaflet-dist/leaflet.js',
        './www/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js',
        './www/lib/angular-leaflet-directive/dist/angular-leaflet-directive.js',
        './www/lib/ionic/js/ionic.js',
        './www/lib/ionic/js/ionic-angular.js',
        './www/lib/ui-router/release/angular-ui-router.js',
        './www/lib/ngCordova/dist/ng-cordova.js'
    ],
    tests: [
        './www/lib/ngCordova/dist/ng-cordova-mocks.js',
        './www/lib/angular-mocks/angular-mocks.js',
        './www/lib/stateMock/stateMock.js',
        './test/unit/**/*.spec.coffee'
    ],
    css: ['./www/lib/ionic/css/ionic.css',
        './www/css/style.css',
        './www/lib/leaflet-dist/leaflet.css',
        './www/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.css',
        './www/lib/bootstrap/dist/css/bootstrap.css',
        './www/lib/bootstrap/dist/css/bootstrap-theme.css'
    ]

};


function wrapPipe(taskFn) {
    return function(done) {
        var onSuccess = function() {
            done();
        };
        var onError = function(err) {
            done(err);
        }
        var outStream = taskFn(onSuccess, onError);
        if(outStream && typeof outStream.on === 'function') {
            outStream.on('end', onSuccess);
        }
    }
}


gulp.task('default', ['sass', 'coffee', 'index']);

gulp.task('sass', function (done) {
    gulp.src('./www/sass/**.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(rename({extname: '.css'}))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./www/css'))
        .on('end', done);
});



gulp.task('index', function () {
    var target = gulp.src('./www/index.html');
    var sources = gulp.src(paths.libs.concat(paths.js).concat(paths.css), {read: false});
    return target.pipe(inject(sources, {
            transform: function (filepath) {
                //skip the prefix './www/'
                if (filepath.startsWith('/www/')) {
                    arguments[0] = filepath.slice(5)
                }
                return inject.transform.apply(inject.transform, arguments)
            }
        }))
        .pipe(gulp.dest('./www'));
});

gulp.task('clean', function(){
    gulp.src('./www/js',{read: false})
        .pipe(clean());
});

/*
 gulp.task('coffee', [], wrapPipe(function(success, error)  {
 var isProd = process.env.NODE_ENV === 'production';
 gulp.src('./www/**-/*.coffee')
 .pipe(coffee({bare: true}))
 .pipe(gulpif(isProd,concat('application.js')))
 .pipe(ngAnnotate())
 .pipe(gulp.dest('./www/js'))
 }))
 */
gulp.task('coffee', [], function (done) {
    var reportError = function(err) {gutil.log(err);done();}
    var isProd = process.env.NODE_ENV === 'production';
    gulp.src('./www/**/*.coffee')
        .pipe(coffee({bare: true}).on('error', reportError))
        .pipe(gulpif(isProd,concat('application.js')))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('./www/js'))
        .on('end', done)
})

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.coffee',
        singleRun: true,
        browsers: ['PhantomJS'],
        files: paths.libs.concat(paths.tests).concat(paths.coffee)
    }, done).start();
});

gulp.task('bdd', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.coffee',
        singleRun: false,
        files: paths.libs.concat(paths.tests).concat(paths.coffee),
        browsers: ['Chrome']
    }, done).start();
});


gulp.task('watch', function () {
    gulp.watch(paths.coffee, ['coffee'])
    gulp.watch(paths.sass, ['sass'])
});


