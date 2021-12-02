const express = require('express');
const router = express.Router();
const { asyncErrorHandler } = require("../middleware");

const { 
    postIndex, 
    postNew,
    postCreate,
    postShow,
    postEdit,
    postUpdate,
    postDelete
} = require("../controllers/postsController");

/* GET posts index /posts */
router.get('/', asyncErrorHandler(postIndex));

/* GET posts new /posts/new */
router.get('/new', postNew);

/* POST posts create /posts/new */
router.post('/', asyncErrorHandler(postCreate));

/* GET posts show /posts/:id */
router.get('/:id', asyncErrorHandler(postShow));

/* GET posts edit /posts/:d/edit */
router.get('/:id/edit', asyncErrorHandler(postEdit));

/* PUT posts update /posts/:d */
router.put('/:id', asyncErrorHandler(postUpdate));

/* DELETE posts destroy /posts/:d */
router.delete('/:id', asyncErrorHandler(postDelete));

module.exports = router;