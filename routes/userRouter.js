const express = require('express');

const router = express.Router()

router.router("/")
    .get(getAllUsers)
    .post(createUser)

router.router("/:id")
    .get(getUserById)
    .patch(updateUserById)
    .delete(deleteUserByIda)

module.exports = router



// router.get("/",getAllUsers)
// router.post("/",createUser)

// router("/:id",getUserById)
// router.patch("/:id",updateUserById)
// router.delete("/:id",deleteUserByIda)