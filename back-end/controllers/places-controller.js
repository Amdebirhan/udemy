const fs = require('fs')
const mongoose = require('mongoose');
const HttpError = require('../models/http-error')
const place = require('../models/place')
const user = require('../models/user')



const getPlaceById = async (req, res, next) => {
    const placeId = req.params.placeId;
    try {
        const result = await place.findById(placeId)
        if (!result) {
            return next(
                new HttpError('could not find z place.', 404)
            );
        }
        res.json({ places: result.toObject({ getters: true }) })
    } catch (err) {
        const error = new HttpError('sonething went wrong could not find the place.', 500);
        return next(error);
    }
}

const getPlaceByUserId = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const result = await place.find({ creator: userId })
        if (!result) {
            return next(
                new HttpError('could not find z place.', 404)
            );
        }
        res.json({ places: result.map(place => place.toObject({ getters: true })) })
    } catch (err) {
        const error = new HttpError('sonething went wrong couldnot find the place.', 500);
        return next(error);
    }
}


const createPlace = async (req, res, next) => {
    const { title, description, address, creator } = req.body;
    coordinates = {
        "lat": 40.7484,
        "long": -73.9857
    };
    //add validation
    const createdPlace = new place({
        title,
        description,
        address,
        location: coordinates,
        image: req.file.path,
        creator
    })

    let User;
    try {
        User = await user.findById(creator);
    } catch (err) {
        const error = HttpError('An error occur please try again.', 500);
        return next(error);
    }
    if (!User) {
        const error = new HttpError('Could not find user.', 404);
        return next(error)
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction()
        await createdPlace.save({ session: session });
        User.places.push(createdPlace);
        await User.save({ session: session });
        await session.commitTransaction();

    } catch (err) {
        const error = new HttpError(err, 500)
        return next(error);
    }


    res.status(201).json({ place: createdPlace })
}

const updatePlace = async (req, res, next) => {
    const { title, description } = req.body;
    const placeId = req.params.placeId;
    let result;
    try {
        result = await place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Create place failed try again.', 500)
        return next(error);
    }

    if (!result) {
        return next(
            new HttpError('could not find z place.', 404)
        );
    }
    result.title = title;
    result.description = description;
    try {
        await result.save()
    } catch (err) {
        const error = new HttpError('Could not  update the place.', 500)
        return next(error);
    }

    res.status(200).json(result)
}

const deletePlace = async (req, res, next) => {

    const placeId = req.params.placeId;
    let result;
    try {
        result = await place.findById(placeId).populate('creator')
        if (!result) {
            return next(
                new HttpError('could not find z place.', 404)
            );
        }
    } catch (err) {
        const error = new HttpError('something went wrong couldnot delete the place.', 500);
        return next(error);
    }

    const imagePath = result.image;

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await result.remove({ session: session });
        result.creator.places.pull(result);
        await result.creator.save({ session: session });
        await session.commitTransaction();
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
    fs.unlink(imagePath, err => {
        console.log(err)
    });

    res.json({ Message: 'Delete place.' })
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;