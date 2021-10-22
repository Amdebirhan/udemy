const HttpError = require("../models/http-error");
const user = require("../models/user");

const getAllUsers = async (req, res, next) => {
    let result;

    try {
        result = await user.find({}, 'email name')
    } catch (err) {
        const error = new HttpError('Can not featch users please try again.', 500);
        return next(error);
    }

    res.json(result)
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
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmFjZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        places: []
    });

    try {
        await createUser.save()
    } catch (err) {
        const error = HttpError('Signup failed try again.', 500)
        return next(error);
    }

    res.status(201).json(createUser)
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

    res.json({ message: "login successfully" })
}

exports.getAllUsers = getAllUsers;
exports.signUp = signUp;
exports.login = login;