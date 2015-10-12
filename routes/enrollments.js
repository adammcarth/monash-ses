module.exports = function(ses) {

    ses.get("/enrollments/new", function(req, res) {
        res.render("test_view", {
            meta_description: "Student enrollment system II by Adam McArthur & Sunny Jain."
        });
    });

};