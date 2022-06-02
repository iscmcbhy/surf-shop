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

    // Get / Register
    getRegister(req, res, next){
        res.render('register', {title: "Register", username: "", email: ""});
    },

    // Post /register
    async postRegister(req, res, next) {
        const newUser = new User(req.body);

        try {
            let user = await User.register(newUser, req.body.password);
            req.login(user, function(err){
                if(err) {
                    return next(err);
                }
                req.session.success = "Welcome to Surf Shop, " + user.username;
                res.redirect('/');
            });
        } catch (err) {
            const { username, email } = req.body;
            let error = err.message;

            if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
                error = 'A user with the given email is already registered';
            }
            res.render('register', { title: 'Register', username, email, error });
        }
    },

    // Get /login
    getLogin(req, res, next){
        if(req.isAuthenticated()) {
            return res.redirect('/');
        }
        if(req.query.returnTo)
            req.session.redirectTo = req.headers.referer;

        res.render('login', {title: "Login"});
    },

    // Post /login
    async postLogin(req, res, next) {
        const { username, password } = req.body;
        const { user, error } = await User.authenticate()(username, password);
        const redirectUrl = req.session.redirectTo || '/';
        
        if(!user && error ) 
            return next(error);

        req.login(user, function(err) {
            if(err) 
                return next(err);

            req.session.success = `Welcome back, ${username}!`;

            res.redirect(redirectUrl);
        });
    },

    // Get /logout
    getLogout(req, res, next) {
        req.logout((err)=> {
            if(err){
                return next(err);
            }
            res.redirect("/");
        });
        
    }
};