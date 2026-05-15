const express = require('express');
const app = express();

app.get('/', (req, res) => {
    console.log('route is working fine');
    res.send('route is working fine');
});

module.exports = app;