const express = require('express');
const router = express.Router();

const { 
    asyncErrorHandler, 
    isLoggedIn, 
    isValidPassword, 
    changePassword 
} = require("../middleware");

const { getProfile, postProfile, updateProfile } = require("../controllers/profileController");

/* GET /profile page. */
router.get('/', isLoggedIn, asyncErrorHandler(getProfile));

/* POST /profile page. */
router.post('/', isLoggedIn, asyncErrorHandler(postProfile));

router.put('/', 
isLoggedIn, 
asyncErrorHandler(isValidPassword),
asyncErrorHandler(changePassword),
asyncErrorHandler(updateProfile)
);

module.exports = router;