const express = require("express")

const router = express.Router();
const { check } = require('express-validator')
const PlacesControllers = require('../controllers/places-controller');


router.get('/:placeId', PlacesControllers.getPlaceById)

router.get('/user/:userId', PlacesControllers.getPlaceByUserId)

router.post('/', check(), PlacesControllers.createPlace)

router.patch('/:placeId', PlacesControllers.updatePlace)

router.delete('/:placeId', PlacesControllers.deletePlace)


module.exports = router;