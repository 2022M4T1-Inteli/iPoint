const express = require('express')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')
const Device = require('../models/device')
const Location = require('../models/location')
const router = express.Router()

router.get('/devices', authMiddleware, async (req, res) => {
    try {
        const devices = await Device.find({}).populate('locations')

        const devicesList = []
        for (let i in devices) {
            const device = devices[i].toObject()
            const locations = await Location.find(
                { deviceId: devices[i].deviceId, room: { $exists: true } },
                { signals: 0 }
            )
            device.room = locations[locations.length - 1]?.room
            device.locations = locations
            devicesList.push(device)
        }

        res.send(devicesList)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.get('/locations', authMiddleware, async (req, res) => {
    try {
        const locations = await Location.find({ room: { $ne: null } }, { signals: 0 })
            .sort({ createdAt: -1 })
            .limit(req.query.limit)
            .exec()
        const locationsList = []
        for (let i in locations) {
            const location = locations[i].toObject()
            const device = await Device.findOne({ deviceId: locations[i].deviceId })
            location.deviceName = device.name
            location.deviceId = device.deviceId
            locationsList.push(location)
        }
        res.send(locationsList)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.get('/device/:id', authMiddleware, async (req, res) => {
    try {
        const device = await Device.findOne({ _id: req.params.id })
        const locations = await Location.find({ deviceId: device.deviceId }, { signals: 0 })
            .sort({ createdAt: -1 })
            .exec()

        const lastLocation = locations[0].room
        const battery = locations[0].battery
        res.send({ locations, device, battery, lastLocation })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

router.patch('/device/:id', authMiddleware, async (req, res) => {
    try {
        await Device.updateOne({ _id: req.params.id }, { name: req.body.name })
        res.send()
    } catch (err) {
        res.status(500).send(err)
    }
})

router.delete('/device/:id', adminMiddleware, async (req, res) => {
    try {
        const recordDevice = await Device.findById(req.params.id)
        await Location.deleteMany({ deviceId: recordDevice.deviceId })
        await Device.deleteOne({ _id: req.params.id })
        res.send()
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router
