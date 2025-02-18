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
    getTourStats,
    getMonthlyPlan
} = require("./../controllers/tourController")
const { protect, restrictTo } = require("./../controllers/authController")



// hint: Router.route("/abc").get(middleware, controller)

const Router = express.Router()

// Router.param("id", checkId)

Router.route("/top-5-cheap").get(topTours, getAllTours)

Router.route("/tour-stats").get(getTourStats)

Router.route("/monthly-plan/:year").get(getMonthlyPlan)

Router.route("/")
    .get(protect, getAllTours)
    .post(protect, createTour)

Router.route("/:id")
    .get(protect, getTourById)
    .patch(protect, updateTourById)
    .delete(protect, restrictTo("admin", 'lead-guide'), deleteTourById)

module.exports = Router



// Router.get("/",protect, getAllTours)
// Router.post("/",protect, checkBody, createTour)
// Router("/:id",protect, getTourById)
// Router.patch("/:id",protect, updateTourById)
// Router.delete("/:id",protect,restrictTo("admin", 'lead-guide'), deleteTourById)