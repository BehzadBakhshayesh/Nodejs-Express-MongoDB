const fs = require('node:fs');
const path = require('node:path');
const express = require('express');

const filePath = path.join(__dirname, '../dev-data/data/tours-simple.json');
const fileData = fs.readFileSync(filePath, 'utf-8');  // 'utf-8' ensures the content is read as a string
const tours = JSON.parse(fileData);


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

    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours))


}

exports.getTourById = (req, res) => {
    const id = req.params.id * 1
    const tour = tours.find(el => el.id === id)
    if (!tour) {
        return res.status(404).json({ status: 'failed', message: "Invalid ID" })
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
}

exports.updateTourById = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({ status: 'failed', message: "Invalid ID" })
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<updated tour here..>'
        }
    })
}

exports.deleteTourById = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({ status: 'failed', message: "Invalid ID" })
    }
    res.status(204).json({
        status: 'success',
        data: 'NULL'
    })
}