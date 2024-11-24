const express = require('express');
const {
    getAllTours,
    createTour,
    getTourById,
    updateTourById,
    deleteTourById
} = require("./../controllers/tourController")

const Router = express.Router()

Router.route("/")
    .get(getAllTours)
    .post(createTour)

Router.route("/:id")
    .get(getTourById)
    .patch(updateTourById)
    .delete(deleteTourById)


module.exports = Router



// Router.get("/",getAlltours)
// Router.post("/",createtour)

// Router("/:id",gettourById)
// Router.patch("/:id",updatetourById)
// Router.delete("/:id",deletetourByIda)