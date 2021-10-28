

const express = require("express")

const router = express.Router();

const userController = require('../controllers/users-controller');
const fileUpload = require("../middleware/file-upload");

router.get('/', userController.getAllUsers)

router.post('/signup', fileUpload.single('image'), userController.signUp)

router.post('/login', userController.login)


module.exports = router;