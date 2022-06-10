const Post = require("../models/postModel");
const Review = require("../models/reviewModel");
const { cloudinary } = require("../cloudinary");
 
// const cloudinary = require("cloudinary");
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET
// });

const mapBoxToken = process.env.MAPBOX_ACCESS_TOKEN;

const mapboxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mapboxGeocoding({ accessToken: mapBoxToken });

module.exports = {
    async postIndex(req, res, next){
        // Modified from .find to .paginate
        const { dbQuery } = res.locals;
        delete res.locals.dbQuery;

        let posts = await Post.paginate(dbQuery, {
            populate: {
                path: "author",
                model: "User"
            },
            page: req.query.page || 1,
            limit: 10,
            //  or sort: '-_id'
            sort: {'_id': -1}
        });

        if(!posts.docs.length && res.locals.query){
            res.locals.error = "No results found on that query!";
        }

        res.render("posts/index", { posts, mapBoxToken, title: "Surf Shop - Posts" });
    },

    postNew(req, res, next){
        res.render("posts/new");
    },

    async postCreate(req, res, next){
        req.body.post.images = [];
        
        for(file of req.files){
            let imageObj = {};

            imageObj = {
                url: file.path,
                public_id: file.filename
            };

            req.body.post.images.push(imageObj);
            
        }

        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.post.location,
                limit: 1
            })
            .send();
        
        req.body.post.geometry = response.body.features[0].geometry;
        
        // Add author
        req.body.post.author = req.user._id;

        let newPost = await Post(req.body.post);

        newPost.properties.description = `
            <strong>
                <a href="/posts/${newPost._id}">${newPost.title}</a>
            </strong>
            <p>
                ${newPost.location}
            </p>
            <p>${newPost.description.substring(0, 20)}...
            </p>
        `;

        await newPost.save();
        
        req.session.success = "Post Created Successfully!"
        res.redirect(`/posts/${newPost._id}`);
    },

    async postShow(req, res, next){
        let post = await Post.findById(req.params.id).populate([
            {
                path: "reviews",
                options: {
                    sort: { _id: -1 }
                },
                populate: {
                    path: "author",
                    model: "User"
                }
            },
            {
                path: "author",
                model: "User"
            }
        ]);

        const floorRating = post.calculateAverageRating();
        // const floorRating = post.avgRating;
        
        res.render("posts/show", { post, mapBoxToken, floorRating });
    },

    async postEdit(req, res, next){
        let post = await Post.findById(req.params.id);
        res.render("posts/edit", { post });
    },
    
    async postUpdate(req, res, next){
        // get post from local variables
        const { post } = res.locals;

        // Check if there's any image for deletion
        if(req.body.deleteImages && req.body.deleteImages.length){
            // Assign deleteImages from body parser to a variable.
            let deleteImages = req.body.deleteImages;

            // loop deleteImages
            for(const public_id of deleteImages){
                // delete images from cloudinary
                await cloudinary.uploader.destroy(public_id);
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
    
                imageObj = {
                    url: file.secure_url,
                    public_id: file.public_id
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

            post.geometry = response.body.features[0].geometry;
            post.location = req.body.post.location;
        }

        // update other fields
        post.title = req.body.post.title;
        post.description = req.body.post.description;
        post.price = req.body.post.price;

        post.properties.description = `
            <strong>
                <a href="/posts/${post._id}">${post.title}</a>
            </strong>
            <p>
                ${post.location}
            </p>
            <p>${post.description.substring(0, 20)}...
            </p>
        `;

        // save to mongodb
        await post.save();

        // redirect
        req.session.success = "Post edited!";
        res.redirect(`/posts/${post.id}`);
    },

    async postDelete(req, res, next){
        const { post } =  res.locals;

        // Check if there is image
        if(post.images){
            let images = post.images;
            
            // Delete Image from cloudinary
            for(const image of images){
                await cloudinary.uploader.destroy(image.public_id);
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