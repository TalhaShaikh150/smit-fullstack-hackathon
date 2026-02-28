// DEPRECATED: authorize is now in auth.middleware.js
// Import from there instead:
// const { authorize } = require("./auth.middleware");

module.exports = require("./auth.middleware").authorize;
