module.exports = function(req, res) {
    res.status(404);

    if ( req.app.get("env") === "development" ) {

        res.render("errors/development/error", {
            use_html_in_title: true,
            html_title: "Error 404 - Not Found",
            error_title: 'Can\'t find: <span class="fade">[' + req.method + ']</span> ' + req.path,
            custom_message: "There is no route defined for the URL you requested.",
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

        res.render("errors/404");
        
    }
};