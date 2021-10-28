const express = require("express")

const router = express.Router();
const { check } = require('express-validator')
const PlacesControllers = require('../controllers/places-controller');
const fileUpload = require('../middleware/file-upload');

router.get('/:placeId', PlacesControllers.getPlaceById)

router.get('/user/:userId', PlacesControllers.getPlaceByUserId)

router.post('/', check(), fileUpload.single('image'), PlacesControllers.createPlace)

router.patch('/:placeId', PlacesControllers.updatePlace)

router.delete('/:placeId', PlacesControllers.deletePlace)


module.exports = router;