const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();
// Create Express Server
const app = express();


// Logging
app.use(morgan('dev'));

// Info GET endpoint
app.get('/info', (req, res, next) => {
    res.send('This is a proxy service which proxies to JSONPlaceholder API.');
});

// Authorization
app.use('', (req, res, next) => {
    if (req.headers.authorization) {
        next();
    } else {
        res.sendStatus(403);
    }
});

// Proxy endpoints
app.use('/json_placeholder', createProxyMiddleware({
    target: process.env.API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/json_placeholder`]: '',
    },
}));

// Start Proxy
app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Starting Proxy at ${process.env.HOST}:${process.env.PORT}`);
});