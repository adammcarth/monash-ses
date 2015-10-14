module.exports = function(ses) {

    let encode = require("urlencode");
    let path = require("path");
    let fs = require("fs");

    ses.get("/courses", function(req, res) {
        res.render("courses/all", {
            msg: req.query.msg,
            msgType: req.query.msgType
        });
    });

    ses.get("/courses/new", function(req, res) {
        res.render("courses/new", {
            msg: req.query.msg,
            msgType: req.query.msgType,
            make_active_new_course: true
        });
    });

    ses.post("/courses/new", function(req, res) {
        // Assign POST variables
        let name = req.body.courseName;

        // First, validate parameters
        if ( !name || name === "" ) {
            let msg = "Please enter a course name.";
            let msgType = "danger";
            res.redirect("/courses/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
        } else {
            // Save the resource
            fs.readFile(path.join(__dirname, "../db/courses.json"), function(err, data) {
                let courses = JSON.parse(data);
                courses["courses"].push(name);
                fs.writeFile(path.join(__dirname, "../db/courses.json"), JSON.stringify(courses, null, 2));

                // Set the success message
                let msg = "The new course, " + name + ", has been created successfully.";
                let msgType = "success";
                res.redirect("/courses/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
            });
        }
    });

    ses.get("/courses/:id", function(req, res) {
        res.render("courses/show", {
            msg: req.query.msg,
            msgType: req.query.msgType
        });
    });

    ses.get("/courses/:id/delete", function(req, res) {
        
    });

};