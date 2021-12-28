const Review = require("../models/reviewModel");

module.exports = {

    // Error Handler
    asyncErrorHandler: (fn) => (req, res, next) => {
        Promise.resolve(fn(req, res, next))
                .catch(next);
    },

    isReviewAuthor: async (req, res, next) => {
        let review = await Review.findById(req.params.review_id);

        if(review.author.equals(req.user._id)){
            return next();
        }

        req.session.error = "Unauthorized Access!";
        return res.redirect("/");
    }
};