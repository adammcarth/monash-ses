module.exports = function(ses) {

    ses.get("/", function(req, res) {
        res.render("test_view", {
            meta_description: "Student enrollment system II by Adam McArthur & Sunny Jain."
        });
    });

    ses.get("/start", function(req, res) {
        res.render("test_view", {
            meta_description: "Student enrollment system II by Adam McArthur & Sunny Jain."
        });
    });

};