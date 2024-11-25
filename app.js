const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRouter');
const tourRouter = require('./routes/tourRouter');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    console.log('Hello from the middleware ');
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    });
});


module.exports = app
