const express = require('express');
const router = express.Router();
const multer = require("multer");
const { storage } = require('../cloudinary/index');

const { 
    asyncErrorHandler, 
    isLoggedIn, 
    isValidPassword, 
    changePassword 
} = require("../middleware");

const { getProfile, postProfile, updateProfile } = require("../controllers/profileController");

const upload = multer({storage});

/* GET /profile page. */
router.get('/', isLoggedIn, asyncErrorHandler(getProfile));

/* POST /profile page. */
router.post('/', isLoggedIn, asyncErrorHandler(postProfile));

router.put('/', 
isLoggedIn,
upload.single('image'), 
asyncErrorHandler(isValidPassword),
asyncErrorHandler(changePassword),
asyncErrorHandler(updateProfile)
);

module.exports = router;