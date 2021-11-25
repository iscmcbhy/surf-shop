const express = require('express');
const router = express.Router({ mergeParams: true});

/* GET reviews index posts/:id/reviews */
router.get('/', function(req, res, next) {
    res.send('posts/:id/reviews - GET');
});

/* POST reviews create posts/:id/reviews/new */
router.post('/', function(req, res, next) {
    res.send('posts/:id/reviews - POST');
});

/* DELETE reviews destroy posts/:id/reviews/:review_id */
router.delete('/:review_id', function(req, res, next) {
    res.send('posts/:id/reviews - delete id');
});

/* PUT reviews update posts/:id/reviews/:review_id */
router.put('/:review_id', function(req, res, next) {
    res.send('posts/:id/reviews - update id');
});

/* GET reviews edit posts/:id/reviews/:review_id/edit */
router.get('/:review_id/edit', function(req, res, next) {
    res.send('posts/:id/reviews - edit id');
});

/* GET reviews new posts/:id/reviews/new */
// router.get('/new', function(req, res, next) {
//     res.send('posts/:id/reviews/new');
// });

/* GET reviews show posts/:id/reviews/:review_id */
// router.get('/:review_id', function(req, res, next) {
//     res.send('posts/:id/reviews - SHOW id');
// });

module.exports = router;