module.exports = function(ses) {

    ses.get("/courses", function(req, res) {
        res.render("test_view", {
            meta_description: "Student enrollment system II by Adam McArthur & Sunny Jain."
        });
    });

    ses.get("/courses/new", function(req, res) {
        res.render("test_view", {
            meta_description: "Student enrollment system II by Adam McArthur & Sunny Jain."
        });
    });

    ses.get("/courses/:id", function(req, res) {
        res.render("test_view", {
            meta_description: "Student enrollment system II by Adam McArthur & Sunny Jain."
        });
    });

    ses.get("/courses/:id/delete", function(req, res) {
        res.render("test_view", {
            meta_description: "Student enrollment system II by Adam McArthur & Sunny Jain."
        });
    });

};