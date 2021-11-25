const express = require('express');
const router = express.Router();

/* GET posts index /posts */
router.get('/', function(req, res, next) {
    res.send('/posts - GET');
});

/* GET posts new /posts/new */
router.get('/new', function(req, res, next) {
    res.send('/posts/new');
});

/* POST posts create /posts/new */
router.post('/', function(req, res, next) {
    res.send('/posts - POST');
});

/* GET posts show /posts/:d */
router.get('/:d', function(req, res, next) {
    res.send('/posts - SHOW id');
});

/* GET posts edit /posts/:d/edit */
router.get('/:d/edit', function(req, res, next) {
    res.send('/posts - edit id');
});

/* PUT posts update /posts/:d */
router.put('/:d', function(req, res, next) {
    res.send('/posts - update id');
});

/* DELETE posts destroy /posts/:d */
router.delete('/:d', function(req, res, next) {
    res.send('/posts - delete id');
});

module.exports = router;