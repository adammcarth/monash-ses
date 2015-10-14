var path = require("path");

module.exports = {
    // Directory structure for the asset pipieline
    "paths": {
        "src": {
            "fonts": path.join(__dirname, "../assets/fonts"),
            "images": path.join(__dirname, "../assets/images"),
            "javascript": path.join(__dirname, "../assets/javascript/source"),
            "stylesheets": path.join(__dirname, "../assets/stylesheets/source")
        },

        "dest": {
            "javascript": path.join(__dirname, "../assets/javascript/compiled"),
            "stylesheets": path.join(__dirname, "../assets/stylesheets/compiled")
        }
    },

    // CSS and JavaScript files to be concatenated together (in specific order!)
    // Specified as a relative filepath from the paths.dest.stylesheets directory
    // Assume SASS has already been compiled into vanilla CSS in its destination
    "collections": {
        "css": {
            "ses": [
                "vendor/bootstrap.min.css",
                "layout.css",
                "style.css"
            ]
        },

        "js": {
            "ses": [
                "vendor/jquery-1.11.3.min.js",
                "vendor/bootstrap.min.js",
                "vendor/main.js"
            ]
        }
    }
};