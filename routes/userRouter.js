const express = require('express')
const {
    getAllUsers,
    updateMe,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById
} = require("./../controllers/userController")
const { signup, login, protect, forgotPassword, resetPassword, updatePassword } = require("./../controllers/authController")

const Router = express.Router()


Router.post('/signup', signup)
Router.post('/login', login)
Router.post('/forgotPassword', forgotPassword)
Router.patch('/resetPassword/:token', resetPassword)

Router.patch('/updateMyPassword', protect, updatePassword)
Router.patch('/updateMe', protect, updateMe)

Router.route("/")
    .get(getAllUsers)
    .post(createUser)

Router.route("/:id")
    .get(getUserById)
    .patch(updateUserById)
    .delete(deleteUserById)

module.exports = Router



// Router.get("/",getAllUsers)
// Router.post("/",createUser)

// Router("/:id",getUserById)
// Router.patch("/:id",updateUserById)
// Router.delete("/:id",deleteUserByIda)