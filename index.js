
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

require('./startup/logging')();
require('./startup/validation')();
require('./startup/router')(app);
require('./startup/db')();

app.listen(port, ()=>{
    console.log('server is running on ' + port);
});