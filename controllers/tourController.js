const Tour = require("./../models/tourModel")
const APIFeaturs = require("./../utils/apiFeaturs")


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

        // const totalTours = await Tour.countDocuments(filterQuery);
        // if (skip >= totalTours) {
        //     return res.status(400).json({
        //         status: 'failed',
        //         message: 'This page does not exist',
        //     });
        // }



        const featurs = new APIFeaturs(Tour.find(), req.query).filter().sort().limitFields().paginate()
        const tours = await featurs.query;


        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: tours.length,
            data: tours,
            page: req.query.page ?? 1,
            limit: req.query.limit ?? 5,
            total: totalTours,
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

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    // _id: '$ratingsAverage',
                    // _id: "$difficulty",
                    // _id: null,
                    _id: { $toUpper: "$difficulty" },
                    numTours: { $sum: 1 },
                    numRating: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            },
            {
                $sort: { avgPrice: 1 }
            },
            {
                $match: { _id: { $ne: 'EASY' } }
            },

        ])

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            data: {
                stats
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'faild',
            message: error
        })
    }
}