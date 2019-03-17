const express = require('express');
const app = express();
app.set('view engine', 'ejs');
require('./api/index')(app);
app.listen(3333, () => {
    console.log('server started!');
});
