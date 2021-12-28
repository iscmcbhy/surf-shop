const Post = require("../models/postModel");
const Review = require("../models/reviewModel");
const cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const mapboxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mapboxGeocoding({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

module.exports = {
    async postIndex(req, res, next){
        // Modified from .find to .paginate
        let posts = await Post.paginate({}, {
            page: req.query.page || 1,
            limit: 10
        });

        res.render("posts/index", {posts, title: "Surf Shop - Posts"});
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

        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.post.location,
                limit: 1
            })
            .send();
        
        req.body.post.coordinates = response.body.features[0].geometry.coordinates;
        
        // Add author
        req.body.post.author = req.user._id;
        await Post.create(req.body.post);
        
        req.session.success = "Post Created Successfully!"
        res.redirect(`/posts`);
    },

    async postShow(req, res, next){
        let post = await Post.findById(req.params.id).populate({
            path: "reviews",
            options: {
                sort: { _id: -1 }
            },
            populate: {
                path: "author",
                model: "User"
            }
        });
        
        res.render("posts/show", { post });
    },

    async postEdit(req, res, next){
        let post = await Post.findById(req.params.id);
        res.render("posts/edit", { post });
    },
    
    async postUpdate(req, res, next){
        // Find post by Id.
        let post = await Post.findById(req.params.id);

        // Check if there's any image for deletion
        if(req.body.deleteImages && req.body.deleteImages.length){
            // Assign deleteImages from body parser to a variable.
            let deleteImages = req.body.deleteImages;

            // loop deleteImages
            for(const public_id of deleteImages){
                // delete images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id);
                // delete images from post.body
                for(const image of post.images){
                    if(image.public_id === public_id){
                        let index = post.images.indexOf(image);
                        post.images.splice(index, 1);
                    }
                }
            }
        }

        // Check if there are new images for upload.
        if(req.files){
            // Upload File
            for(file of req.files){
                let imageObj = {};
                let image = await cloudinary.v2.uploader.upload(file.path);
    
                imageObj = {
                    url: image.secure_url,
                    public_id: image.public_id
                };
                
                post.images.push(imageObj);
            }
        }

        if(post.location !== req.body.post.location){
            let response = await geocodingClient
            .forwardGeocode({
                query: req.body.post.location,
                limit: 1
            })
            .send();

            post.coordinates = response.body.features[0].geometry.coordinates;
            post.location = req.body.post.location;
        }

        // update other fields
        post.title = req.body.post.title;
        post.description = req.body.post.description;
        post.price = req.body.post.price;

        // save to mongodb
        await post.save();

        // redirect
        res.redirect(`/posts/${post.id}`);
    },

    async postDelete(req, res, next){
        let post = await Post.findById(req.params.id);

        // Check if there is image
        if(post.images){
            let images = post.images;
            
            // Delete Image from cloudinary
            for(const image of images){
                await cloudinary.v2.uploader.destroy(image.public_id);
            }
        }

        // Remove from MongoDB
        await post.remove();

        // Redirect
        req.session.success = "Post deleted successfully!";
        res.redirect("/posts/");
    }
};

// Use locus for debugging not console.log