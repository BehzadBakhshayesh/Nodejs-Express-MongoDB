const express = require('express');
const tourControllers = reqire("../")
const router = express.Router()

router.router("/")
    .get(getAlltours)
    .post(createtour)

router.router("/:id")
    .get(gettourById)
    .patch(updatetourById)
    .delete(deletetourByIda)


module.exports = router



// router.get("/",getAlltours)
// router.post("/",createtour)

// router("/:id",gettourById)
// router.patch("/:id",updatetourById)
// router.delete("/:id",deletetourByIda)