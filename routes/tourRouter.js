const express = require('express');
const { getAlltours, createtour, gettourById, updatetourById, deletetourByIda } = require("./../controllers/tourController")
const router = express.Router()

router.route("/")
    .get(getAlltours)
    .post(createtour)

router.route("/:id")
    .get(gettourById)
    .patch(updatetourById)
    .delete(deletetourByIda)


module.exports = router



// router.get("/",getAlltours)
// router.post("/",createtour)

// router("/:id",gettourById)
// router.patch("/:id",updatetourById)
// router.delete("/:id",deletetourByIda)