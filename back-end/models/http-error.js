class HttpError extends Error {
    constructor(message, errorCode) {
        super(message) //call the error class constructor
        this.code = errorCode
    }
}

module.exports = HttpError;