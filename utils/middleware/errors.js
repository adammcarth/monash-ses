module.exports = function(error, req, res, next) {
    let custom = {};

    if ( error.status === 401) {
        custom.status = 401;
        custom.html_title = "Error 401 - Unauthorized";
    } else if ( error.status === 400 ) {
        custom.status = 400;
        custom.html_title = "Error 400 - Bad Request";
    } else if ( error.status === 403 ) {
        custom.status = 403;
        custom.html_title = "Error 403 - Forbidden";
    } else {
        custom.status = 500;
        custom.html_title = "Error 500 - Internal Server Error";
    }

    res.status(custom.status);

    if ( req.app.get("env") === "development" ) {

        res.render("errors/development/error", {
            html_title: custom.html_title,
            error_title: error.message,
            error_stack: error.stack,
            params: JSON.stringify(req.params, null, 2),
            query: JSON.stringify(req.query, null, 2),
            cookies: JSON.stringify(req.cookies, null, 2),
            hostname: req.hostname,
            ip: req.ip,
            protocol: req.protocol,
            is_secure: req.secure,
            xhr: req.xhr,
            environment: req.app.get("env"),
            deploy_id: req.app.get("deploy_id"),
            git_branch: req.app.get("git_branch"),
            version: req.app.get("version")
        });

    } else {

        res.render("errors/" + custom.status);

    }
}