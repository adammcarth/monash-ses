// Contains some helper functions for the front end with the handlebars templating system.
// Keys below can be used in handlebars to call a function, for example,
// {{ #pretify_html arg1 arg2 ... }}
let path = require("path");
let asset_config = require(path.join(__dirname, "../config/assets.js"));
let datetime = require(path.join(__dirname, "datetime.js"));
let environment = process.env.ENVIRONMENT || process.env.NODE_ENV || "development";

module.exports = {
    // Custom handlebars helper that pretifies html on the front end with correct indentation
    pretify_html: function(spaces, content) {
        let indentation = new Array(spaces + 1).join(" ");
        if ( content.fn(this).includes("\n") ) {
            let first_line = content.fn(this).split("\n")[0];
            let other_lines = content.fn(this).split("\n").slice(1);

            // Loop through each line of HTML and add the required indentation
            other_lines.forEach(function(line, index) {
                other_lines[index] = indentation + other_lines[index];
            });

            // Merge all lines together once more and return the formatted HTML
            other_lines.unshift(first_line);
            return other_lines.join("\n");
        } else {
            return content.fn(this);
        }
    },

    // Appends the assets path to the specified file
    asset: function(file) {
        return "/" + path.join("assets", file);
    },

    // Appends the image path to the specified image
    image: function(file) {
        return "/" + path.join("assets/images", file);
    },

    // Appends the stylesheet path to the specified stylesheet
    stylesheet: function(file) {
        return "/" + path.join("assets/stylesheets", file);
    },

    // Appends the javascript path to the specified js file
    javascript: function(file) {
        return "/" + path.join("assets/javascript", file);
    },

    // Appends the fonts path to the specified font file
    font: function(file) {
        return "/" + path.join("assets/fonts", file);
    },

    // Includes correct stylesheets for CSS/JS collections based off the environment
    css_collection: function(name) {
        if ( environment != "development" ) {
            return '<link rel="stylesheet" type="text/css" href="/' + path.join("assets/stylesheets/collections", name + ".min.css") + '" media="screen" />';
        } else {
            let group = '';
            let newline = '';
            let components = asset_config.collections.css[name];
            components.forEach(function(file) {
                group = group + newline + '<link rel="stylesheet" type="text/css" href="/' + path.join("assets/stylesheets", file) + '" media="screen" />';
                newline = '\n';
            });

            return group;
        }
    },

    js_collection: function(name) {
        if ( environment != "development" ) {
            return '<script type="text/javascript" src="/' + path.join("assets/javascript/collections", name + ".min.js") + '"></script>';
        } else {
            let group = '';
            let newline = '';
            let components = asset_config.collections.js[name];
            components.forEach(function(file) {
                group = group + newline + '<script type="text/javascript" src="/' + path.join("assets/javascript", file) + '"></script>';
                newline = '\n';
            });

            return group;
        }
    },

    time_ago_in_words: function(timestamp) {
        let time_ago_in_words = require("time_ago_in_words");
        return time_ago_in_words(timestamp.fn(this));
    }
};