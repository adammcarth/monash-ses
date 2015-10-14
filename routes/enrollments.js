module.exports = function(ses) {

    let encode = require("urlencode");
    let path = require("path");
    let fs = require("fs");

    ses.get("/enrollments/new", function(req, res) {
        fs.readFile(path.join(__dirname, "../db/courses.json"), function(err, data) {
            let courses = JSON.parse(data);
            let courses_array = courses["courses"];
            fs.readFile(path.join(__dirname, "../db/units.json"), function(err, data) {
                let units = JSON.parse(data);
                res.render("enrollments/new", {
                    msg: req.query.msg,
                    msgType: req.query.msgType,
                    make_active_new_enrollment: true,
                    courses: courses_array,
                    units: units
                });
            });
        });
    });

    ses.post("/enrollments/new", function(req, res) {
        // Assign POST variables
        let studentID = req.body.studentID;
        let courseName = req.body.courseName;
        let units = req.body.units;

        // First, validate parameters
        if ( !studentID || studentID === "" ) {
            let msg = "Please enter a Student ID.";
            let msgType = "danger";
            res.redirect("/enrollments/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
        } else if ( !courseName || courseName === "" ) {
            let msg = "Please enter a course name.";
            let msgType = "danger";
            res.redirect("/enrollments/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
        } else if ( !units || units === "" || units === {} ) {
            let msg = "Please enter units to enroll the student in.";
            let msgType = "danger";
            res.redirect("/enrollments/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
        } else {
            // Save the resource
            fs.readFile(path.join(__dirname, "../db/enrollments.json"), function(err, data) {
                let enrollments = JSON.parse(data);
                let student_id_enrolled = false;
                Object.keys(enrollments).forEach(function(key) {
                    if ( key === studentID ) {
                        student_id_enrolled = true;
                    }
                });

                if ( student_id_enrolled ) {
                    let msg = "This student is already enrolled. To overwrite this, use an '!' at the end of their ID. Eg - '" + studentID + "!'.";
                    let msgType = "warning";
                    res.redirect("/enrollments/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
                } else {
                    studentID = studentID.split("!").join("");
                    fs.readFile(path.join(__dirname, "../db/students.json"), function(err, data) {
                        let students = JSON.parse(data);
                        let ids = Object.keys(students);
                        if ( ids.indexOf(studentID) === -1 ) {
                            let msg = "Student ID does not exist in the system.";
                            let msgType = "danger";
                            res.redirect("/enrollments/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
                        } else {
                            if ( students[studentID]["workload"] === "Part-time" && units.length > 3 ) {
                                let msg = "Part time students cannot be enrolled in more than 3 units.";
                                let msgType = "danger";
                                res.redirect("/enrollments/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
                            } else if ( students[studentID]["studyType"] === "International" && units.length != 4 ) {
                                let msg = "International students must be enrolled in exactly 4 units.";
                                let msgType = "danger";
                                res.redirect("/enrollments/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
                            } else if ( units.length > 5 ) {
                                let msg = "Students cannot be enrolled in more than 5 units for any given semester.";
                                let msgType = "danger";
                                res.redirect("/enrollments/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
                            } else {
                                enrollments[studentID] = { course: courseName, units: units }
                                fs.writeFile(path.join(__dirname, "../db/enrollments.json"), JSON.stringify(enrollments, null, 2));

                                // Set the success message
                                let msg = "The student (" + studentID + ") has been successfully enrolled.";
                                let msgType = "success";
                                res.redirect("/enrollments/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
                            }
                        }
                    });
                }
            });
        }
    });

};