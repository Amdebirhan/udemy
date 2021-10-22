const express = require("express")
const bodyParser = require("body-parser")
const HttpError = require("./models/http-error")
const placeRoutes = require("./routes/places-routes")
const userRoutes = require("./routes/users-routes")
const mongoose = require("mongoose")

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    next();
});

app.use('/api/places', placeRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
    const error = new HttpError('could not found this route', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred.' })
})

mongoose
    .connect('mongodb+srv://amde:blackland@cluster0.2tl6l.mongodb.net/places?retryWrites=true&w=majority')
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    })
