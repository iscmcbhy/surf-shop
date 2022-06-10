const User = require("../models/userModel");
const Post = require("../models/postModel");
const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require("../middleware");
const crypto = require('crypto');
const sendGridMail = require('@sendgrid/mail');
const util = require('util');

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

module.exports = {
    // Get /landingPage
    async landingPage(req, res,next){
        // find all post
        const posts = await Post.find({}).sort('-_id').exec();
        const recentPosts = posts.slice(0, 3);

        res.render("index", { posts, recentPosts, mapboxToken: MAPBOX_TOKEN, title: 'Surf Shop - Home' });
    },

    // Get / Register
    getRegister(req, res, next){
        res.render('register', {title: "Register", username: "", email: ""});
    },

    // Post /register
    async postRegister(req, res, next) {
        try {
            if(req.file){
                const { path, filename } = req.file;

                req.body.image = {
                    secure_url: path,
                    public_id: filename
                }
            }

            let user = await User.register(new User(req.body), req.body.password);

            req.login(user, function(err){
                if(err) {
                    return next(err);
                }

                req.session.success = "Welcome to Surf Shop, " + user.username;
                res.redirect('/');

            });

        } catch (err) {
            deleteProfileImage(req);

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
        
    },

    // GET forgot password
    getForgotPassword(req, res, next){
        res.render('users/forgot-password');
    },

    // PUT forgot password
    async putForgotPassword(req, res, next){
        const token = await crypto.randomBytes(20).toString('hex');
        const { email } = req.body;
        const user = await User.findOne({ email });

        if(!user){
            req.session.error = "E-mail Address does not exist!";
            return res.redirect('/forgot-password');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();

        const message = {
            to: email,
            from: "Surf Shop Support <isaac.mcbhy@gmail.com>",
            subject: "Forgot Password Reset!",
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
			Please click on the following link, or copy and paste it into your browser to complete the process:
			http://${req.headers.host}/reset-password/${token}
			If you did not request this, please ignore this email and your password will remain unchanged.`.replace(/			/g, ''),
        };

        await sendGridMail.send(message);

        req.session.success = `An e-mail has been sent to ${email} with further instructions.`;

        res.redirect('/forgot-password');
    },

    // GET Reset password
    async getResetPassword(req, res, next){
        const { token } = req.params;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if(!user){
            req.session.error = "Token invalid or expired.";
            
            return res.redirect('/forgot-password');
        }

        res.render('users/reset-password', { token });
    },

    // PUT Reset password
    async putResetPassword(req, res, next){
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if(!user){
            req.session.error = "Token invalid or expired.";
            
            return res.redirect(`/reset-password/${ token }`);
        }
        
        if(newPassword === confirmPassword){
            await user.setPassword(newPassword);

            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            
            await user.save();

            // Bypass Login
            const login = util.promisify(req.login.bind(req));
            await login(user);

        } else {
            req.session.error = "Password mismatch!";
            return res.redirect(`/reset-password/${ token }`);
        }

        const message = {
            to: user.email,
            from: "Surf Shop Support <isaac.mcbhy@gmail.com>",
            subject: "Forgot Password Reset!",
            text: `This email is to confirm that the password for your account has just been changed.
            If you did not make this change, please hit reply and notify us at once.`.replace(/            /g, ''),
        };

        await sendGridMail.send(message);

        req.session.success = "Password successfully updated!";
        res.redirect('/');
    }
};