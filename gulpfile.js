var del = require("del");
var path = require("path");
var merge = require("merge-stream");
var runSequence = require("run-sequence");

var gulp = require("gulp");
var sass = require("gulp-sass"),
    es6transpiler = require("gulp-es6-transpiler"),
    copyDir = require("ncp").ncp,
    uglify = require("gulp-uglify"),
    cssmin = require("gulp-minify-css"),
    rename = require("gulp-rename"),
    concatCSS = require("gulp-concat-css"),
    concatJS = require("gulp-concat");

/////////////////////////////////////////////////////////////////
// 01. DEFINE THE ASSET PIPELINE CONFIGURATION                 //
/////////////////////////////////////////////////////////////////
    
    var asset_config = require(path.join(__dirname, "config/assets.js"));

    // Directories of the different asset groups (eg - javascript, css, images etc)
    var paths = asset_config.paths;

    // Specifically defined collections of CSS and Javascript
    var collections = asset_config.collections;

/////////////////////////////////////////////////////////////////
// 02. REMOVE OLD SCRIPTS FROM THE COMPILED DIRECTORY          //
/////////////////////////////////////////////////////////////////

    gulp.task("delete:old-assets", function () {
        return del([
            path.join(paths.dest.stylesheets, "/**/*.css"),
            path.join(paths.dest.javascript, "/**/*.js")
        ]);
    });

/////////////////////////////////////////////////////////////////
// 03. COMPILE SASS                                            //
/////////////////////////////////////////////////////////////////

    gulp.task("sass", function() {
        return gulp.src([path.join(paths.src.stylesheets, "sass/**/*.scss"), path.join(paths.src.stylesheets, "sass/**/*.css")])
            .pipe(sass().on("error", sass.logError))
            .pipe(gulp.dest(paths.dest.stylesheets));
    });

/////////////////////////////////////////////////////////////////
// 04. COMPILE FRONTEND ES6 => ES5                             //
/////////////////////////////////////////////////////////////////

    gulp.task("es6", function() {
        return gulp.src(path.join(paths.src.javascript, "es6/**/*.js"))
            .pipe(es6transpiler())
            .pipe(gulp.dest(paths.dest.javascript));
    });

/////////////////////////////////////////////////////////////////
// 05. COPY VENDOR ASSETS TO THE COMPILED DIRECTORY            //
/////////////////////////////////////////////////////////////////

    gulp.task("copy:vendor-css", function() {
        return copyDir(path.join(paths.src.stylesheets, "vendor"), path.join(paths.dest.stylesheets, "vendor"), function(err) {
            if (err) throw err;
            return true;
        });
    });

    gulp.task("copy:vendor-js", function() {
        return copyDir(path.join(paths.src.javascript, "vendor"), path.join(paths.dest.javascript, "vendor"), function(err) {
            if (err) throw err;
            return true;
        });
    });

/////////////////////////////////////////////////////////////////
// 06. CONCATENATE SCRIPT COLLECTIONS FOR PRODUCTION           //
/////////////////////////////////////////////////////////////////
    
    // STYLESHEET COLLECTIONS
        gulp.task("concat:css", function() {
            var tasks = merge();

            // Add root assets path to CSS collection files
            Object.keys(collections.css).forEach(function(name) {
                collections.css[name].forEach(function(file, index) {
                    collections.css[name][index] = path.join(paths.dest.stylesheets, collections.css[name][index]);
                });
            });

            // Loop through each CSS collection and run a seperate concat task
            Object.keys(collections.css).forEach(function(name) {
                tasks.add(gulp.src(collections.css[name])
                    .pipe(concatCSS("collections/" + name + ".css"))
                    .pipe(gulp.dest(paths.dest.stylesheets)));
            });

            return tasks;
        });

    // JAVASCRIPT COLLECTIONS
        gulp.task("concat:js", function() {
            var tasks = merge();

            // Add root assets path to JS collection files
            Object.keys(collections.js).forEach(function(name) {
                collections.js[name].forEach(function(file, index) {
                    collections.js[name][index] = path.join(paths.dest.javascript, collections.js[name][index]);
                });
            });

            // Loop through each JS collection and run a seperate concat task
            Object.keys(collections.js).forEach(function(name) {
                tasks.add(gulp.src(collections.js[name])
                    .pipe(concatJS("collections/" + name + ".js"))
                    .pipe(gulp.dest(paths.dest.javascript)));
            });

            return tasks;
        });

/////////////////////////////////////////////////////////////////
// 07. MINIFY STYLESHEETS AND JAVASCRIPT                       //
/////////////////////////////////////////////////////////////////

    gulp.task("minify:css", function () {
        return gulp.src([path.join(paths.dest.stylesheets, "/**/*.css"), "!" + path.join(paths.dest.stylesheets, "/**/*.min.css")])
            .pipe(cssmin())
            .pipe(rename({extname: ".min.css"}))
            .pipe(gulp.dest(paths.dest.stylesheets));
    });

    gulp.task("minify:js", function() {
        return gulp.src([path.join(paths.dest.javascript, "/**/*.js"), "!" + path.join(paths.dest.javascript, "/**/*.min.js")])
            .pipe(uglify())
            .pipe(rename({extname: ".min.js"}))
            .pipe(gulp.dest(paths.dest.javascript));
    });

/////////////////////////////////////////////////////////////////
// 08. GULP TASK GROUPS                                        //
/////////////////////////////////////////////////////////////////

    gulp.task("default", function() {
        runSequence(
            "delete:old-assets", // single
            ["sass", "es6", "copy:vendor-css", "copy:vendor-js"], // can be run in parallel
            ["concat:css", "concat:js"],
            ["minify:css", "minify:js"]
        );
    });

    gulp.task("watch:assets", function() {
        gulp.watch(path.join(paths.src.stylesheets, "vendor/**/*.css"), function() {
            runSequence("copy:vendor-css", "concat:css", "minify:css");
        });

        gulp.watch(path.join(paths.src.javascript, "vendor/**/*.js"), function() {
            runSequence("copy:vendor-js", "concat:js", "minify:js");
        });

        gulp.watch([path.join(paths.src.stylesheets, "sass/**/*.scss"), path.join(paths.src.stylesheets, "sass/**/*.css")], function() {
            runSequence("sass", "concat:css", "minify:css");
        });

        gulp.watch(path.join(paths.src.javascript, "es6/**/*.js"), function() {
            runSequence("es6", "concat:js", "minify:js");
        });

        gulp.watch(path.join(__dirname, "config/assets.js"), ["default"]);
    });