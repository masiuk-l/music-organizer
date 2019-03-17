const apiTest = require('./test');
const apiListFiles = require('./listFiles');
const apiSortFiles = require('./sortFiles');
module.exports = function(app) {
    apiTest(app);
    apiListFiles(app);
    apiSortFiles(app);
    // other routes
};