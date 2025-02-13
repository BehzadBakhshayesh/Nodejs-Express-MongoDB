const AppError = require("../utils/appError")

const handleCastErrorDB = error => {
    const message = `Invalid ${error.path} : ${error.value}`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = error => {
    const value = error.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
    const message = `Duplicate field value:${value}. please use another value`
    return new AppError(message, 400)
}

const handleValidationErrorDB = error => {
    const errors = Object.values(error.errors).map((el) => el.message)
    const message = `Invalid input data ${errors.join('. ')}`
    return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    })
}

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    } else {
        console.error("ERRRRRROORRRRR: ", err);

        res.status(500).json({
            status: 'error',
            message: "Somthing went very wrong",
        })
    }

}

module.exports = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {

        let error = { ...err }

        if (error.name === 'CastError') {
            // invalid db id => /tours/wwwww
            error = handleCastErrorDB(error)
        }
        if (error.code === '11000') {
            error = handleDuplicateFieldsDB(error)
        }
        if (error.name === 'ValidationError') {
            error = handleValidationErrorDB(error)
        }

        sendErrorProd(error, res)
    }
}
