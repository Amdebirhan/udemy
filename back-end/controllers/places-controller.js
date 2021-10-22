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
        res.json(result)
    } catch (err) {
        const error = HttpError('sonething went wrong couldnot find the place.', 500);
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
        res.json(result)
    } catch (err) {
        const error = HttpError('sonething went wrong couldnot find the place.', 500);
        return next(error);
    }
}


const createPlace = async (req, res, next) => {
    const { title, description, coordinates, address, creator } = req.body;
    console.log(req.body)
    //add validation
    const createdPlace = new place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        creator
    })

    let user;
    try {

    } catch (err) {
        const error = HttpError('Creating place failed. please try again', 500);
        return next(error);
    }
    if (!user) {
        const error = HttpError('Could not find user.', 404);
        return next(error)
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction()
        await createdPlace.save({ session: session });
        user.places.push(createdPlace);
        await user.save({ session: session });
        await session.commitTransaction();

    } catch (err) {
        const error = HttpError('Create place failed try again.', 500)
        return next(error);
    }


    res.status(201).json({ place: createdPlace })
}

const updatePlace = async (req, res, next) => {
    const { title, description } = req.body;
    const id = req.params.placeId;
    let result;
    try {
        result = await place.findById(placeId);
    } catch (err) {
        const error = HttpError('Create place failed try again.', 500)
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
        const error = HttpError('Could not  update the place.', 500)
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
        const error = new HttpError('sonething went wrong couldnot delete the place.', 500);
        return next(error);
    }


    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await result.remove({ session: session });
        result.creator.pull(result);
        await pleace.creator.save({ session: session });
        await session.commitTransaction();
    } catch (err) {
        const error = new HttpError('sonething went wrong couldnote delete place.', 500);
        return next(error);
    }
    res.json({ Message: 'Delete place.' })
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;