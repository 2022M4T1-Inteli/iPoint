const express = require('express')
const Device = require('../models/device')
const Location = require('../models/location')
const router = express.Router()

router.get('/devices', async (req ,res) => {
    try {
        const devices = await Device.find({})

        for (let i in devices) {
            const lastLocation = await Location.findOne({deviceId: devices[i]._id})
            devices[i].room = lastLocation.room
        }
        res.send(devices)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/locations', async (req, res) => {
    try {
        const locations = await Location.find({}).sort('createdAt', 1).exec()

        for (let i in locations) {
            const device = await Device.findOne({_id: locations[i].deviceId})
            locations[i].deviceName = device.name
        }
        res.send(locations)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/device/:id', async (req, res)=> {
    try {
        const locations = await Location.find({deviceId: req.params.id}).sort('createdAt', 1).exec()
        const device = await Device.findOne({_id: req.params.id})
        const lastLocation = locations[locations.length -1].room
        
        res.send({locations, device, lastLocation})
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router