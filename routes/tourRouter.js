const express = require('express');
const {
    // checkId,
    // checkBody,
    getAllTours,
    createTour,
    getTourById,
    updateTourById,
    deleteTourById,
    topTours,
    getTourStats
} = require("./../controllers/tourController")

const Router = express.Router()

// Router.param("id", checkId)

Router.route("/top-5-cheap").get(topTours, getAllTours)

Router.route("/tour-stats").get(getTourStats)

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