module.exports = function() {

/////////////////////////////////////////////////////////////////
// 01. DEPENDANCIES                                            //
/////////////////////////////////////////////////////////////////

    // Loads express under the ses namespace
    let express = require("express");
    let ses = express();

    let path = require("path");
    let http = require("http");
    let cookieParser = require("cookie-parser");
    let bodyParser = require('body-parser');
    let logger = require("morgan");
    let fs = require("fs");
    let FileStreamRotator = require("file-stream-rotator");
    let Handlebars = require("express-handlebars");
    let git = require("git-rev");
    let pjson = require(path.join(__dirname, "package.json"));

/////////////////////////////////////////////////////////////////
// 02. EXPRESS CONFIGURATION                                   //
/////////////////////////////////////////////////////////////////

    // Set the environment to arguments passed in from the command line. Reverts to development.
    ses.set("env", process.env.ENVIRONMENT || process.env.NODE_ENV || "development");

    // Port that ses listens to when the server starts
    ses.set("port", process.env.PORT || 4150);

    // Files in '/server/public' will be served up in the route '/public/<file>'
    ses.use("/public", express.static(path.join(__dirname, "/server/public")));

    // This is the default view directory, but set it manually to be safe
    ses.set("views", path.join(__dirname, "/views"));

    // Set the templating engine to handlebars (templates will use .html file extension)
    ses.engine(".html", Handlebars({defaultLayout: "default", extname: ".html", helpers: require(path.join(__dirname, "/utils/handlebars.js"))}));
    ses.set("view engine", ".html");
    Handlebars.ExpressHandlebars.prototype.layoutsDir = path.join(__dirname, "/views/layouts");

    // Serve compiled assets to public
    ses.use("/assets/stylesheets", express.static(path.join(__dirname, "/assets/stylesheets/compiled")));
    ses.use("/assets/javascript", express.static(path.join(__dirname, "/assets/javascript/compiled")));
    ses.use("/assets/images", express.static(path.join(__dirname, "/assets/images")));
    ses.use("/assets/fonts", express.static(path.join(__dirname, "/assets/fonts")));

    // Parse cookies and session data
    ses.use(cookieParser());
    ses.use(bodyParser.json());
    ses.use(bodyParser.urlencoded({ extended: true }));

/////////////////////////////////////////////////////////////////
// 03. EXTERNAL API KEYS, DATABASES & OTHER CONFIGURATION      //
/////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////
// 04. ROUTES & LOGGING                                        //
/////////////////////////////////////////////////////////////////

    // Log requests to console in non-production environments
    if ( ses.get("env") != "production" ) {
        ses.use(require(path.join(__dirname, "utils/middleware/log.js")));
    }

    // Write access logs to disk in production
    if ( ses.get("env") === "production" ) {

        // Setup access logging filestream rotator (new file for each day)
        let accessLogStream = FileStreamRotator.getStream({
            filename: path.join(__dirname, "server/log/access-%DATE%.log"),
            frequency: "daily",
            verbose: false
        });

        ses.use(logger("combined", {stream: accessLogStream}));

    }

    // Import all routes (controllers) for the application
    require(path.join(__dirname, "routes", "pages.js"))(ses);
    require(path.join(__dirname, "routes", "students.js"))(ses);
    require(path.join(__dirname, "routes", "units.js"))(ses);
    require(path.join(__dirname, "routes", "courses.js"))(ses);
    require(path.join(__dirname, "routes", "enrollments.js"))(ses);

    // Handle Error 401, 400, 403 & 500
    ses.use(require(path.join(__dirname, "utils/middleware/errors.js")));
    // Handle Error 404 (not found)
    ses.use(require(path.join(__dirname, "utils/middleware/errors_404.js")));

/////////////////////////////////////////////////////////////////
// 05. SERVER                                                  //
/////////////////////////////////////////////////////////////////

    // Run the server
    http.createServer(ses).listen(ses.get("port"), function(){
        console.log("---");
        console.log("ses is now running on port " + ses.get("port") + "...");
        ses.set("version", pjson.version);
        console.log("Version: " + pjson.version);

        // Set the deployment id to the git commit hash id
        git.long(function(id) {
            ses.set("deploy_id", id);
            ses.set("deploy_id", id);
            console.log("Deploy ID: " + ses.get("deploy_id"));

            // Output the current active branch name and environment
            git.branch(function(branch) {
                ses.set("git_branch", branch);
                console.log("From branch: " + branch);
                console.log("Mode: " + ses.get("env") + "\n");
            });
        });
    });
    
};