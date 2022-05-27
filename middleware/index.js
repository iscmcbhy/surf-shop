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

    isLoggedIn: function(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }

        req.session.error = 'You are currently logged out!';
		req.session.redirectTo = req.originalUrl;
        req.session.save();
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
    }
};