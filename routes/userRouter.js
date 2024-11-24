const express = require('express')
const {
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserByIda
} = require("./../controllers/userController")


const router = express.Router()

router.route("/")
    .get(getAllUsers)
    .post(createUser)

router.route("/:id")
    .get(getUserById)
    .patch(updateUserById)
    .delete(deleteUserByIda)

module.exports = router



// router.get("/",getAllUsers)
// router.post("/",createUser)

// router("/:id",getUserById)
// router.patch("/:id",updateUserById)
// router.delete("/:id",deleteUserByIda)