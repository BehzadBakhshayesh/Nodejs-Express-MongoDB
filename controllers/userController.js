const User = require("./../models/userModel")
const APIFeaturs = require("./../utils/apiFeaturs")
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el]
        }
    })
    return newObj
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: users.length,
        data: users,
        page: req.query.page ?? 1,
        limit: req.query.limit ?? 5,
    });
})

exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password uodates, please use /updateMyPassword.', 400))
    }

    const filteredBody = filterObj(req.body, 'name', 'email')
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true })

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }

    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {

    await User.findByIdAndUpdate(req.user.id, { active: false })

    res.status(204).json({
        status: 'success',
        data: null

    })
})


exports.getUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
exports.updateUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
exports.deleteUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};