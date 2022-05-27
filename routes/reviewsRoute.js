const express = require('express');
const router = express.Router({ mergeParams: true });

const { asyncErrorHandler, isReviewAuthor, isLoggedIn } = require("../middleware");
const { 
    reviewCreate, 
    reviewUpdate,
    reviewDelete
} = require("../controllers/reviewsController");

/* POST reviews create posts/:id/reviews/new */
router.post('/', isLoggedIn, asyncErrorHandler(reviewCreate));

/* DELETE reviews destroy posts/:id/reviews/:review_id */
router.delete('/:review_id', isReviewAuthor, asyncErrorHandler(reviewDelete));

/* PUT reviews update posts/:id/reviews/:review_id */
router.put('/:review_id', isReviewAuthor, asyncErrorHandler(reviewUpdate));

module.exports = router;