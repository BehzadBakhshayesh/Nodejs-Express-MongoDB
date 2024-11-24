const express = require('express')
const {
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById
} = require("./../controllers/userController")


const Router = express.Router()

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