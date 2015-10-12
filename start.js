var path = require("path");

// Compile all server side Javascript from ES6 to ES5
require(path.join(__dirname, "/utils/es6.js"));

// Require the application and start it
require(path.join(__dirname, '/index'))();