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



exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find()
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'faild',
            message: error
        })
    }
}

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
            message: "Invalid Data Sent!"
        })
    }

}

exports.getTourById = async (req, res) => {

    try {
        const tour = await Tour.findById(req.params.id)
        // const tour = await Tour.findOne({ _id: req.params.id })
        if(tour){
            res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            data: {
                tour
            }
        })
    }else{
            throw new Error("tour not found")
        }
        
    } catch (error) {
        res.status(404).json({
            status: 'faild',
            message: error
        })
    }
}

exports.updateTourById =async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators:true
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

exports.deleteTourById =async (req, res) => {
    try {
       const tour= await Tour.findByIdAndDelete(req.params.id)
       
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