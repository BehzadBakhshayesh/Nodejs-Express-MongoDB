const { promisify } = require('util');
const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })
    const token = signToken(newUser._id)
    res.status(201).json({
        status: 'success',
        token,
        data: { user: newUser }
    })

})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please Provive Email or Password', 400))
    }
    const user = await User.findOne({ email }).select('+password')
    // const correct= await bcrypt.compare(password, user.password)
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect Email or Password', 401))
    }
    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token,
    })
})

exports.protect = catchAsync(async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(new AppError('You Are not logged in! please login to get access', 401))
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401))
    }
    if (currentUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! please log in again.', 401))
    }
    req.user = currentUser
    next()
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403))
        }
        next()
    }
}


exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = User.findOne({ email: req.body.email })
    if (!user) {
        return next(new AppError('There is no user email address', 404))
    }
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to : ${resetURL}.\n If you don't forget your password , please ignore this email!`

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token (valid for 10 min)",
            message
        })
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        })
    } catch (err) {
        user.passwordResetToken = 'undefined'
        user.passwordResetExpires = 'undefined'
        await user.save({ validateBeforeSave: false })
        return next(new AppError('There was an error sending the email. try again later!', 500))
    }
})
exports.resetPassword = catchAsync(async (req, res, next) => { })
