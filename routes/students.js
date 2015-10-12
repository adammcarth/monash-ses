module.exports = function(ses) {

    ses.get("/students", function(req, res) {
        res.render("test_view", {
            meta_description: "Student enrollment system II by Adam McArthur & Sunny Jain."
        });
    });

    ses.get("/students/new", function(req, res) {
        res.render("test_view", {
            meta_description: "Student enrollment system II by Adam McArthur & Sunny Jain."
        });
    });

    ses.get("/students/:id", function(req, res) {
        res.render("test_view", {
            meta_description: "Student enrollment system II by Adam McArthur & Sunny Jain."
        });
    });

    ses.get("/students/search", function(req, res) {
        res.render("test_view", {
            meta_description: "Student enrollment system II by Adam McArthur & Sunny Jain."
        });
    });

    ses.get("/students/:id/delete", function(req, res) {
        res.render("test_view", {
            meta_description: "Student enrollment system II by Adam McArthur & Sunny Jain."
        });
    });

};