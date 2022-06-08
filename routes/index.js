const express = require('express');
const router = express.Router();
const multer = require("multer");
const { asyncErrorHandler, isLoggedIn } = require("../middleware");
const { storage } = require('../cloudinary');

const { 
    postRegister, 
    getRegister,
    postLogin, 
    getLogin,
    getLogout, 
    landingPage,
    getForgotPassword,
    putForgotPassword,
    getResetPassword,
    putResetPassword
} = require("../controllers"); // Deconstructuring multiple lines

const upload = multer({storage});

/* GET home page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET /register page. */
router.get("/register", getRegister);

/* POST /register page. */
router.post("/register", upload.single('image'), asyncErrorHandler(postRegister));

/* GET /login page. */
router.get("/login", getLogin);

/* POST /login page. */
router.post("/login", asyncErrorHandler(postLogin));

/* GET /logout page. */
router.get("/logout", getLogout);

/* PUT /profile/:user_id page. */
router.put("/profile/:user_id", (req, res, next) => {
    res.send("PUT /profile/:user_id");
});

/* GET /forgot page. */
router.get("/forgot-password", getForgotPassword);

/* PUT /forgot page. */
router.put("/forgot-password", asyncErrorHandler(putForgotPassword));

/* GET /reset/:token page. */
router.get("/reset-password/:token", asyncErrorHandler(getResetPassword));

/* PUT /reset page. */
router.put("/reset-password/:token", asyncErrorHandler(putResetPassword));

router.get("/test", (req, res, next) => {
    res.render("starability", { title: 'Surf Shop - Home' });
});

module.exports = router;
