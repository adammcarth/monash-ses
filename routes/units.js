module.exports = function(ses) {

    let encode = require("urlencode");
    let path = require("path");
    let fs = require("fs");

    ses.get("/units", function(req, res) {
        res.render("units/all", {
            msg: req.query.msg,
            msgType: req.query.msgType
        });
    });

    ses.get("/units/new", function(req, res) {
        res.render("units/new", {
            msg: req.query.msg,
            msgType: req.query.msgType,
            make_active_new_unit: true
        });
    });

    ses.post("/units/new", function(req, res) {
        // Assign POST variables
        let unitCode = req.body.unitCode;
        let unitName = req.body.unitName;

        // First, validate parameters
        if ( !unitCode || unitCode === "" ) {
            let msg = "Please enter a unit code.";
            let msgType = "danger";
            res.redirect("/units/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
        } else if ( !unitName || unitName === "" ) {
            let msg = "Please enter a unit name.";
            let msgType = "danger";
            res.redirect("/units/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
        } else if ( !/^([A-Z]{3}[0-9]{4})$/.test(unitCode) ) {
            let msg = "Unit code must be in the format ABC1234 (three characters followed by four digits).";
            let msgType = "danger";
            res.redirect("/units/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
        } else {
            // Save the resource
            fs.readFile(path.join(__dirname, "../db/units.json"), function(err, data) {
                let units = JSON.parse(data);
                let unitCodeUsed = false;
                Object.keys(units).forEach(function(key) {
                    if ( key === unitCode ) {
                        unitCodeUsed = true;
                    }
                });

                if ( unitCodeUsed ) {
                    // Set the success message
                    let msg = "Sorry, that unit code is already in use.";
                    let msgType = "danger";
                    res.redirect("/units/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
                } else {
                    units[unitCode] = unitName;
                    fs.writeFile(path.join(__dirname, "../db/units.json"), JSON.stringify(units, null, 2));

                    // Set the success message
                    let msg = "The unit has been successfully created.";
                    let msgType = "success";
                    res.redirect("/units/new?msg=" + encode(msg) + "&msgType=" + encode(msgType));
                }
            });
        }
    });

    ses.get("/units/:id", function(req, res) {
        res.render("units/show", {
            msg: req.query.msg,
            msgType: req.query.msgType
        });
    });

    ses.get("/units/:id/delete", function(req, res) {
        
    });

};