const { json } = require("express")
const Tour = require("./../models/tourModel")


// exports.checkId = (req, res, next, val) => {
//     console.log(`Tour id is ${val}`);
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'failed',
//             message: "Invalid ID"
//         })
//     }
//     next()
// }

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: 'failed',
//             message: "Missing name or price "
//         })
//     }
//     next()
// }

exports.topTours = async (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}

exports.getAllTours = async (req, res) => {
    try {
        // Extract query parameters
        const { sort, fields, page = 1, limit = 5, ...filters } = req.query;

        // Convert query operators (gte, gt, lte, lt) to MongoDB equivalents
        const filterQuery = JSON.parse(
            JSON.stringify(filters).replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        );

        // Build the query
        let query = Tour.find(filterQuery);

        // Apply sorting
        if (sort) {
            const sortBy = sort.split(',').join(' ');
            query = query.sort(sortBy);
        }

        // Select specific fields or exclude `__v` by default
        if (fields) {
            const queryFields = fields.split(',').join(' ');
            query = query.select(queryFields);
        } else {
            query = query.select('-__v');
        }

        // Apply pagination
        const queryPage = Math.max(parseInt(page), 1); // Ensure page is at least 1
        const queryLimit = Math.max(parseInt(limit), 1); // Ensure limit is at least 1
        const skip = (queryPage - 1) * queryLimit;

        // Get total number of documents matching the filters
        const totalTours = await Tour.countDocuments(filterQuery);

        // Check if the requested page exists
        // if (skip >= totalTours) {
        //     throw new Error("This page does not exist")
        // }
        if (skip >= totalTours) {
            return res.status(400).json({
                status: 'failed',
                message: 'This page does not exist',
            });
        }

        // Apply skip and limit to the query
        query = query.skip(skip).limit(queryLimit);

        // Execute the query
        // query.sort().select().skip().limit()
        const tours = await query;

        // Respond with the data
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: tours.length,
            total: totalTours,
            page: queryPage,
            limit: queryLimit,
            data: tours,
        });
    } catch (error) {
        // Handle errors
        res.status(404).json({
            status: 'failed',
            message: error.message || 'Unable to retrieve tours',
        });
    }
};


exports.createTour = async (req, res) => {
    try {
        // const newTour = new Tour({})
        // newTour.save()
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'faild',
            message: error
        })
    }

}

exports.getTourById = async (req, res) => {

    try {
        const tour = await Tour.findById(req.params.id)
        // const tour = await Tour.findOne({ _id: req.params.id })
        if (tour) {
            res.status(200).json({
                status: 'success',
                requestedAt: req.requestTime,
                data: {
                    tour
                }
            })
        } else {
            throw new Error("tour not found")
        }

    } catch (error) {
        res.status(404).json({
            status: 'faild',
            message: error
        })
    }
}

exports.updateTourById = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            data: {
                tour
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'faild',
            message: error
        })
    }
}

exports.deleteTourById = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: 'success',
            requestedAt: req.requestTime,
        })
    } catch (error) {
        res.status(404).json({
            status: 'faild',
            message: error
        })
    }
}