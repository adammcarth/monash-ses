module.exports = function(ses) {

    let encode = require("urlencode");
    let path = require("path");
    let fs = require("fs");

    ses.get("/students", function(req, res) {
        res.render("students/all", {
            msg: req.query.msg,
            msgType: req.query.msgType
        });
    });

    ses.get("/students/new", function(req, res) {
        res.render("students/new", {
            msg: req.query.msg,
            msgType: req.query.msgType,
            make_active_new_student: true
        });
    });

    ses.post("/students/new", function(req, res) {
        // Assign POST variables
        let studentName = req.body.studentName;
        let studyLevel = req.body.studyLevel;
        let studyType = req.body.studyType;
        let workload = req.body.workload;

        // First, validate parameters
        if ( !studentName || studentName === "" ) {
            let msg = "Please enter the student's name.";
            let msgType = "danger";
            res.redirect("/students/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
        } else if ( !studyLevel || studyLevel === "" ) {
            let msg = "Please enter the study level.";
            let msgType = "danger";
            res.redirect("/students/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
        } else if ( !studyType || studyType === "" ) {
            let msg = "Please enter the study type.";
            let msgType = "danger";
            res.redirect("/students/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
        } else if ( !workload || workload === "" ) {
            let msg = "Please enter the student's workload.";
            let msgType = "danger";
            res.redirect("/students/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
        } else {
            // Save the resource
            fs.readFile(path.join(__dirname, "../db/students.json"), function(err, data) {
                let students = JSON.parse(data);
                let new_student_id = Math.floor(Math.random() * 99999999) + 10000000;
                students[new_student_id] = { name: studentName, studyLevel: studyLevel, studyType: studyType, workload: workload }
                fs.writeFile(path.join(__dirname, "../db/students.json"), JSON.stringify(students, null, 2));

                // Set the success message
                let msg = "The student has been successfully created. New ID: " + new_student_id;
                let msgType = "success";
                res.redirect("/students/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
            });
        }
    });

    ses.get("/students/search", function(req, res) {
        fs.readFile(path.join(__dirname, "../db/students.json"), function(err, data) {
            let students = JSON.parse(data);
            let filtered_students = [];

            if ( req.query.studyType === "domestic" ) {
                Object.keys(students).forEach(function(key) {
                    if ( students[key]["studyType"] === "Domestic" ) {
                        filtered_students.push([key, students[key]["name"]]);
                    }
                });
            } else if ( req.query.studyType === "international" ) {
                Object.keys(students).forEach(function(key) {
                    if ( students[key]["studyType"] === "International" ) {
                        filtered_students.push([key, students[key]["name"]]);
                    }
                });
            } else if ( req.query.workload === "full" ) {
                Object.keys(students).forEach(function(key) {
                    if ( students[key]["workload"] === "Full-time" ) {
                        filtered_students.push([key, students[key]["name"]]);
                    }
                });
            } else if ( req.query.workload === "part" ) {
                Object.keys(students).forEach(function(key) {
                    if ( students[key]["workload"] === "Part-time" ) {
                        filtered_students.push([key, students[key]["name"]]);
                    }
                });
            } else if ( req.query.studyLevel === "ugrad" ) {
                Object.keys(students).forEach(function(key) {
                    if ( students[key]["studyLevel"] === "Undergraduate" ) {
                        filtered_students.push([key, students[key]["name"]]);
                    }
                });
            } else if ( req.query.studyLevel === "pgrad" ) {
                Object.keys(students).forEach(function(key) {
                    if ( students[key]["studyLevel"] === "Postgraduate" ) {
                        filtered_students.push([key, students[key]["name"]]);
                    }
                });
            }

            if ( filtered_students === [] ) { filtered_students = undefined; }

            res.render("students/search", {
                msg: req.query.msg,
                msgType: req.query.msgType,
                make_active_search: true,
                filtered_students: filtered_students
            });
        });
    });

    ses.post("/students/search", function(req, res) {
        res.redirect("/students/" + req.body.studentID);
    });

    ses.get("/students/:id", function(req, res) {
        let studentID = req.params.id;
        fs.readFile(path.join(__dirname, "../db/students.json"), function(err, data) {
            let students = JSON.parse(data);
            let student = students[studentID];
            if ( student ) {
                fs.readFile(path.join(__dirname, "../db/enrollments.json"), function(err, data) {
                    let enrollments = JSON.parse(data);
                    let enrollment = enrollments[studentID];

                    if (enrollment) {
                        let courseName = enrollment["course"];
                        let units = enrollment["units"];
                    } else {
                        courseName = "Not enrolled.";
                        units = ["Not enrolled."];
                    }

                    res.render("students/show", {
                        msg: req.query.msg,
                        msgType: req.query.msgType,
                        id: studentID,
                        name: students[studentID]["name"],
                        studyLevel: students[studentID]["studyLevel"],
                        studyType: students[studentID]["studyType"],
                        workload: students[studentID]["workload"],
                        courseName: enrollments[studentID]["course"],
                        units: enrollments[studentID]["units"]
                    });
                });
            } else {
                res.status(404);
                res.render("errors/404.html");
            }
        });
    });

    ses.get("/students/:id/delete", function(req, res) {
        
    });

};