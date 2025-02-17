const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const { promisify } = require('util');

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