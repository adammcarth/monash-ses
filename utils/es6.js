// Compiles ES6 Javascript into ES5.
// Note, this file is the only file that cannot have ES6 syntax.
// This util is required in /start.js

var traceur = require("traceur");
require("traceur-source-maps").install(traceur);

traceur.require.makeDefault(function (filePath) {
    return !~filePath.indexOf("node_modules");
});