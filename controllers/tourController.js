const Tour = require("./../models/tourModel")
const APIFeaturs = require("./../utils/apiFeaturs")
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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

exports.getAllTours = catchAsync(async (req, res) => {

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
        // total: totalTours,
    });
});

exports.createTour = catchAsync(async (req, res, next) => {

    // const newTour = new Tour({})
    // newTour.save()
    const newTour = await Tour.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })


})

exports.getTourById = catchAsync(async (req, res, next) => {

    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.findOne({ _id: req.params.id })
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
            tour
        }
    })


})

exports.updateTourById = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    )
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
            tour
        }
    })

})

exports.deleteTourById = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id)
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        requestedAt: req.requestTime,
    })

})

exports.getTourStats = catchAsync(async (req, res, next) => {
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

})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates:
                {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numToursStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: { _id: 0 }
        },
        {
            $sort: { numToursStarts: -1 }
        },
        {
            $limit: 6
        }
    ])

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
            plan
        }
    })

})