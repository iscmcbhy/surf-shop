const Review = require("../models/reviewModel");
const Post = require("../models/postModel");

module.exports = {

    async reviewCreate(req, res, next){
        // find the post by its ID
        let post = await Post.findById(req.params.id);
        // Create the review
        req.body.review.author = req.user._id;
        let review = await Review.create(req.body.review);
        // assign review to post
        post.reviews.push(review);
        // save the post
        post.save();

        req.session.success = "Review Added!";
        // redirect to the post
        res.redirect(`/posts/${post.id}`);
    },
    
    async reviewUpdate(req, res, next){
        // Update
        await Review.findByIdAndUpdate(req.params.review_id, req.body.review);

        req.session.success = "Review Updated!";
        // redirect to the post
        res.redirect(`/posts/${req.params.id}`);
    },

    async reviewDelete(req, res, next){
        await Review.findByIdAndDelete(req.params.review_id);
        req.session.success = "Review Removed!";
        res.redirect(`/posts/${req.params.id}`);
    }
};

// Use locus for debugging not console.log