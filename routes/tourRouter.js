const express = require('express');
const {
    getAlltours,
    createtour,
    gettourById,
    updatetourById,
    deleteTourById
} = require("./../controllers/tourController")

const Router = express.Router()

Router.route("/")
    .get(getAlltours)
    .post(createtour)

Router.route("/:id")
    .get(gettourById)
    .patch(updatetourById)
    .delete(deleteTourById)


module.exports = Router



// Router.get("/",getAlltours)
// Router.post("/",createtour)

// Router("/:id",gettourById)
// Router.patch("/:id",updatetourById)
// Router.delete("/:id",deletetourByIda)