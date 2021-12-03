const Post = require("../models/postModel");
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "dtktyrnad",
    api_key: "855264766554614",
    api_secret: "Zqlna1QBPvP0R1PGLK6vu73ZQig"
});

module.exports = {
    async postIndex(req, res, next){
        let posts = await Post.find({});

        res.render("posts/index", {posts});
    },

    postNew(req, res, next){
        res.render("posts/new");
    },

    async postCreate(req, res, next){
        req.body.post.images = [];
        
        for(file of req.files){
            let imageObj = {};
            let image = await cloudinary.v2.uploader.upload(file.path);

            imageObj = {
                url: image.secure_url,
                public_id: image.public_id
            };

            req.body.post.images.push(imageObj);
        }

        await Post.create(req.body.post);
        
        res.redirect(`/posts`);
    },

    async postShow(req, res, next){
        let post = await Post.findById(req.params.id);
        res.render("posts/show", { post });
    },

    async postEdit(req, res, next){
        let post = await Post.findById(req.params.id);
        res.render("posts/edit", { post });
    },
    
    async postUpdate(req, res, next){
        let post = await Post.findByIdAndUpdate(req.params.id, req.body.post);
        res.redirect(`/posts/${post.id}`);
    },

    async postDelete(req, res, next){
        await Post.findByIdAndDelete(req.params.id);
        res.redirect("/posts/");
    }
};

// Use locus for debugging not console.log