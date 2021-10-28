const HttpError = require("../models/http-error");
const user = require("../models/user");

const getAllUsers = async (req, res, next) => {
    let users;

    try {
        users = await user.find({}, '-password')
    } catch (err) {
        const error = new HttpError('Can not featch users please try again.', 500);
        return next(error);
    }

    res.json({ users: users.map(user => user.toObject({ getters: true })) })
}

const signUp = async (req, res, next) => {
    const { name, email, password } = req.body;
    let userExist;
    try {
        userExist = await user.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('sign up fail please try again.', 500);
        return next(error);
    }

    if (userExist) {
        const error = new HttpError('user exist already.please try again', 422);
        return next(error);
    }

    const createUser = new user({
        name,
        email,
        password,
        image: req.file.path,
        places: []
    });

    try {
        await createUser.save()
    } catch (err) {
        const error = HttpError('Signup failed try again.', 500)
        return next(error);
    }

    res.status(201).json({ user: createUser.toObject({ getters: true }) })
}


const login = async (req, res, next) => {
    const { email, password } = req.body;
    let userExist;
    try {
        userExist = await user.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('login fail please try again.', 500);
        return next(error);
    }

    if (!userExist || userExist.password !== password) {
        const error = new HttpError('Invalid credential.', 422);
        return next(error);
    }

    res.json({ user: userExist.toObject({ getters: true }) })
}

exports.getAllUsers = getAllUsers;
exports.signUp = signUp;
exports.login = login;