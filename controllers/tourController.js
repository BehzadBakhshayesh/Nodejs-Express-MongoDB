const fs = require('node:fs');
const path = require('node:path');
const express = require('express');

const filePath = path.join(__dirname, '../dev-data/data/tours-simple.json');
const fileData = fs.readFileSync(filePath, 'utf-8');  // 'utf-8' ensures the content is read as a string
const tours = JSON.parse(fileData);


exports.checkId = (req, res, next, val) => {
    console.log(`Tour id is ${val}`);

    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'failed',
            message: "Invalid ID"
        })
    }
    next()
}


exports.checkBody = (req, res, next) => {

    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'failed',
            message: "Missing name or price "
        })
    }
    next()
}



exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    })
}

exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({ id: newId }, req.body)

    tours.push(newTour)

    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })


}

exports.getTourById = (req, res) => {
    const id = req.params.id * 1
    const tour = tours.find(el => el.id === id)

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
}

exports.updateTourById = (req, res) => {

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<updated tour here..>'
        }
    })
}

exports.deleteTourById = (req, res) => {

    res.status(204).json({
        status: 'success',
        data: 'NULL'
    })
}