module.exports = function(ses) {

    ses.get("/", function(req, res) {
        res.render("start", {
            msg: req.query.msg,
            msgType: req.query.msgType,
            make_active_start: true
        });
    });

};