module.exports = {
    // Eg - Thursday
    day: function(timestamp) {
        let strftime = require("strftime");
        return strftime("%A", timestamp);
    },

    // Eg - April
    month: function(timestamp) {
        let strftime = require("strftime");
        return strftime("%B", timestamp);
    },

    // Eg - 04
    month_num: function(timestamp) {
        let strftime = require("strftime");
        return strftime("%m", timestamp);
    },

    // Eg - 2016
    year: function(timestamp) {
        let strftime = require("strftime");
        return strftime("%Y", timestamp);
    },

    // Equivalent to %m/%d/%y in en-US (based on locale)
    date: function(timestamp) {
        let strftime = require("strftime");
        return strftime("%D", timestamp);
    },

    // Eg - Thursday, 6th September 2016
    fullDate: function(timestamp) {
        let strftime = require("strftime");
        return strftime("%A, %o %B %Y", timestamp);
    },

    // Eg - 6pm
    hour: function(timestamp) {
        let strftime = require("strftime");
        return strftime("%l%P", timestamp);
    },

    // Eg - 06:52pm
    time: function(timestamp) {
        let strftime = require("strftime");
        return strftime("%I:%M%P", timestamp);
    },

    // Eg - Just now || 42 minutes go || about a year ago
    time_ago_in_words: function(timestamp) {
        let time_ago_in_words = require("time_ago_in_words");
        return time_ago_in_words(timestamp);
    },

    // Eg - "An appointment on Sep 12-13" => Fri Sep 12 2014 12:00:00 GMT-0500 (CDT)
    timestamp_from_words: function(text) {
        let chrono = require("chrono-node");
        return chrono.parseDate(text);
    }
}