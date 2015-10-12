## Stylesheet Compiling

Stylesheets are compiled from the `./source` folder and into the `./compiled` folder by gulp. This performs tasks such as CSS concatination, as well as minification.

The `./compiled` folder is available publically on the front end via the path `/assets/stylesheets`.

## What are Vendor Stylesheets?

Place CSS libraries here that are not owned or maintained by you. Stylesheets in this directory won't be minified (it should already be in .min format), and also helps seperate your internally written CSS from external libraries.