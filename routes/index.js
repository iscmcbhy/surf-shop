const express = require('express');
const router = express.Router();
const passport = require("passport");
const { asyncErrorHandler } = require("../middleware");
const { postRegister, postLogin, getLogout } = require("../controllers"); // Deconstructuring multiple lines

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Surf Shop - Home' });
});

/* GET /register page. */
router.get("/register", (req, res, next) => {
    res.send("GET Register");
});

/* POST /register page. */
router.post("/register", asyncErrorHandler(postRegister));

/* GET /login page. */
router.get("/login", (req, res, next) => {
    res.send("GET Login");
});

/* POST /login page. */
router.post("/login", asyncErrorHandler(postLogin));

/* GET /logout page. */
router.get("/logout", getLogout);

/* GET /profile page. */
router.get("/profile", (req, res, next) => {
    res.send("GET profile");
});

/* POST /profile page. */
router.post("/profile", (req, res, next) => {
    res.send("POST profile");
});

/* PUT /profile/:user_id page. */
router.put("/profile/:user_id", (req, res, next) => {
    res.send("PUT /profile/:user_id");
});

/* GET /forgot page. */
router.get("/forgot", (req, res, next) => {
    res.send("GET /forgot");
});

/* PUT /forgot page. */
router.put("/forgot", (req, res, next) => {
    res.send("PUT /forgot");
});

/* GET /reset/:token page. */
router.get("/reset/:token", (req, res, next) => {
    res.send("GET /reset/:token");
});

/* PUT /reset page. */
router.put("/reset/:token", (req, res, next) => {
    res.send("PUT /reset/:token");
});

router.get("/test", (req, res, next) => {
    res.render("starability", { title: 'Surf Shop - Home' });
});

module.exports = router;
