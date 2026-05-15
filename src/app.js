const express = require('express');
const app = express();

// middlewares
app.use(express.json());

// health
app.get('/', (req, res) => {
    return res.send('route is working fine');
});

// auth routes
const authRouter = require('./route/auth.route');
app.use('/api/auth', authRouter);

module.exports = app;