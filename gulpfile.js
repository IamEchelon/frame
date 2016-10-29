/*
|--------------------------------------------------------------------------
| Required Modules
|--------------------------------------------------------------------------
*/

var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var ts           = require('gulp-typescript');
var sourcemaps   = require('gulp-sourcemaps');
var plumber      = require('gulp-plumber');
var notify       = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var twig         = require('gulp-twig');

/*
|--------------------------------------------------------------------------
| Main Tasks
|--------------------------------------------------------------------------
*/

   
    /*
    |----------------------------------------------
    | Browsersync
    |----------------------------------------------
    */

    gulp.task('browser-sync', function() {

        // initialize browser-sync server on localhost:3000
        browserSync.init({

            // server object
            server: {

                // root for server
                baseDir: './'
            }
        });
    });

    /*
    |----------------------------------------------
    | Sass
    |----------------------------------------------
    */

    gulp.task('sass', function() {
        
        return gulp
        
            // input files 
            .src('./build/styles/sass/**/screen.scss')

            // create sourcemap
            .pipe( sourcemaps.init() )

            // Sass options object
            .pipe( sass( { outputStyle: 'compressed'} )

            // handles errors through notify
            .on('error', notify.onError(function (error) {
                return "Message to the notifier: " + error.message;
            }))
            )

            // prevents errors from stopping gulp
            .pipe(plumber())

            // browser preifixes  
            .pipe(autoprefixer())

            // output sourcemap
            .pipe(sourcemaps.write('../css'))

            // output files
            .pipe(gulp.dest('./dist/styles/css'))

            // conntection to browser-sync
            .pipe(browserSync.stream());
    });

    /*
    |----------------------------------------------
    | TypeScript
    |----------------------------------------------
    */

    gulp.task("ts", function() {

        return gulp
        
            // input files
            .src('./build/scripts/ts/*.ts')

            // handles errors through notify
            .on('error', notify.onError(function (error) {
                return "Message to the notifier: " + error.message;
            }))

            // prevents errors from stopping gulp
            .pipe(plumber())

            // create sourcemap
            .pipe(sourcemaps.init())

            // TypeScript object
            .pipe(ts({

                // throws error on implicit any if enabled
                noImplicitAny: true,

                // name of output file
                outFile: 'main.js',

                pretty: true


            }))

            // output sourcemap
            .pipe(sourcemaps.write('../js'))

            // output files 
            .pipe(gulp.dest('./dist/scripts/js/'))

            // conntection to browser-sync
            .pipe(browserSync.stream());
    });

    /*
    |----------------------------------------------
    | HTML
    |----------------------------------------------
    */

    // setup so that changes to the html file can be monitored 
    gulp.task('html', function() {
        
        gulp
        
        .src('./*.html')

        // conntection to browser-sync
        .pipe(browserSync.stream());
    });

/*
|--------------------------------------------------------------------------
| Watch Task
|--------------------------------------------------------------------------
*/

gulp.task('watch', function() {
    gulp.watch('./styles/sass/**/*.scss', ['sass']);
    gulp.watch('./scripts/ts/*.ts', ['ts']);
    gulp.watch('./*.html', ['html']);
});

/*
|--------------------------------------------------------------------------
| Default Task
|--------------------------------------------------------------------------
*/

gulp.task('default', ['sass', 'ts', 'html', 'browser-sync','watch']);
