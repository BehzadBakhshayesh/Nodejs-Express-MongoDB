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


userRouter.use("/user/api", userRouter)
tourRouter.use("/tour/api", tourRouter)


module.exports = app
