const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({"dest": "uploads/"});

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './uploads/');
//     },
//     filename: function(req, file, cb) {
//         const ext = file.mimetype.split("/")[1];
//         cb(null, Date.now() + "." + ext);
//     }
// });

// const upload = multer({storage: storage});

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
router.post('/', upload.array("images", 4), asyncErrorHandler(postCreate));

/* GET posts show /posts/:id */
router.get('/:id', asyncErrorHandler(postShow));

/* GET posts edit /posts/:d/edit */
router.get('/:id/edit', asyncErrorHandler(postEdit));

/* PUT posts update /posts/:d */
router.put('/:id', upload.array("images", 4), asyncErrorHandler(postUpdate));

/* DELETE posts destroy /posts/:d */
router.delete('/:id', asyncErrorHandler(postDelete));

module.exports = router;