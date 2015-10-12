## Javascript Compiling

Javascript is compiled from the `./source` folder and into the `./compiled` folder by gulp. This performs tasks such as JS concatination, as well as minification and compiling ES6 syntax into ES5 for the browser.

The `./compiled` folder is available publically on the front end via the path `/assets/javascript`.

## What is Vendor Javascript?

Place Javascript libraries here that are not owned or maintained by you. Javascript in this directory won't be compiled from ES6 to ES5 (it should already be in ES5 format), and also helps seperate your internally written Javascript from external libraries.