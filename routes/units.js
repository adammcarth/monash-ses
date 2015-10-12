module.exports = function(ses) {

    ses.get("/units", function(req, res) {
        res.render("test_view", {
            meta_description: "Student enrollment system II by Adam McArthur & Sunny Jain."
        });
    });

    ses.get("/units/new", function(req, res) {
        res.render("test_view", {
            meta_description: "Student enrollment system II by Adam McArthur & Sunny Jain."
        });
    });

    ses.get("/units/:id", function(req, res) {
        res.render("test_view", {
            meta_description: "Student enrollment system II by Adam McArthur & Sunny Jain."
        });
    });

    ses.get("/units/:id/delete", function(req, res) {
        res.render("test_view", {
            meta_description: "Student enrollment system II by Adam McArthur & Sunny Jain."
        });
    });

};