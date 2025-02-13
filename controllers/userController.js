const User = require("./../models/userModel")
const APIFeaturs = require("./../utils/apiFeaturs")
const catchAsync = require('./../utils/catchAsync');


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

exports.createUser = (req, res) => {
    res.status(500).json({ status: "error", message: "this route is not yet defined" })
}

exports.getUserById = (req, res) => {
    res.status(500).json({ status: "error", message: "this route is not yet defined" })
}

exports.updateUserById = (req, res) => {
    res.status(500).json({ status: "error", message: "this route is not yet defined" })
}

exports.deleteUserById = (req, res) => {
    res.status(500).json({ status: "error", message: "this route is not yet defined" })
}