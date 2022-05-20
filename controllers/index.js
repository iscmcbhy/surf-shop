const User = require("../models/userModel");
const Post = require("../models/postModel");
const passport = require("passport");

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

module.exports = {
    // Get /landingPage
    async landingPage(req, res,next){
        // find all post
        const posts = await Post.find({});

        res.render("index", { posts, mapboxToken: MAPBOX_TOKEN, title: 'Surf Shop - Home' });
    },

    // Post /register
    async postRegister(req, res, next) {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            image: req.body.image
        });

        await User.register(newUser, req.body.password);
        
        res.redirect('/');
    },

    // Post /login
    postLogin(req, res, next) {
        passport.authenticate('local', { 
            successRedirect: "/", 
            failureRedirect: "/login"
        })(req, res, next);
    },

    // Get /logout
    getLogout(req, res, next) {
        req.logout();
        res.redirect("/login");
    }
};