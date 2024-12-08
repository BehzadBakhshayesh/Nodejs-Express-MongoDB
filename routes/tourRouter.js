const express = require('express');
const {
    // checkId,
    // checkBody,
    getAllTours,
    createTour,
    getTourById,
    updateTourById,
    deleteTourById
} = require("./../controllers/tourController")

const Router = express.Router()

// Router.param("id", checkId)

Router.route("/")
    .get(getAllTours)
    .post(createTour)

Router.route("/:id")
    .get(getTourById)
    .patch(updateTourById)
    .delete(deleteTourById)


module.exports = Router



// Router.get("/", getAllTours)
// Router.post("/", checkBody, createTour)

// Router("/:id",getTourById)
// Router.patch("/:id",updateTourById)
// Router.delete("/:id",deleteTourById)