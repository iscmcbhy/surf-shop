const express = require('express');
const router = express.Router({ mergeParams: true });

const { asyncErrorHandler } = require("../middleware");
const { 
    reviewCreate, 
    reviewUpdate,
    reviewDelete
} = require("../controllers/reviewsController");

/* POST reviews create posts/:id/reviews/new */
router.post('/', asyncErrorHandler(reviewCreate));

/* DELETE reviews destroy posts/:id/reviews/:review_id */
router.delete('/:review_id', asyncErrorHandler(reviewDelete));

/* PUT reviews update posts/:id/reviews/:review_id */
router.put('/:review_id', asyncErrorHandler(reviewUpdate));

module.exports = router;