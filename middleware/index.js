const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");

module.exports = {

    // Error Handler
    asyncErrorHandler: (fn) => (req, res, next) => {
        Promise.resolve(fn(req, res, next))
                .catch(next);
    },

    isReviewAuthor: async (req, res, next) => {
        let review = await Review.findById(req.params.review_id);

        if(review.author.equals(req.user._id)){
            res.locals.review = review;
            return next();
        }

        req.session.error = "Unauthorized Access!";
        res.redirect('back');
    },

    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        }

        req.session.error = 'You are currently logged out!';
		req.session.redirectTo = req.originalUrl;

		res.redirect('/login');
    },

    isPostAuthor: async (req, res, next) => {
        const post = await Post.findById(req.params.id);

        if(post.author.equals(req.user._id)){
            res.locals.post = post;
            return next();
        }

        req.session.error = "Access Denied!";
        res.redirect('back');
    },

    isValidPassword: async (req, res, next) => {
        // Authenticate user
        // High Order Function
        const { user } = await User.authenticate()(req.user.username, req.body.currentPassword);

        if(user){
            // add user to locals 
            res.locals.user = user;
            
            next();
        } else {
            req.session.error = "Incorrect Current Password!";

            return res.redirect('/profile');
        }
    },

    changePassword: async (req, res, next) => {
        // Destructuer passwords from form body
        const {
            newPassword,
            confirmPassword
        } = req.body;

        if(newPassword && confirmPassword){
            // get user by destructuring res.locals
            const { user } = res.locals;

            // check if valid
            if(newPassword === confirmPassword){
                // set new password
                await user.setPassword(newPassword);

                next();
            } else {
                // flash error
                req.session.error = "New and Confirm password mismatch!";

                return res.redirect('/profile')
            }

        } else {
            next();
        }
    }
};