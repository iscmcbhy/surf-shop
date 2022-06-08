const Post = require('../models/postModel');
const util = require('util');
const { cloudinary } = require('../cloudinary');

module.exports = {
    getProfile: async (req, res, next) => {
        let posts = await Post.find({"author" : req.user._id}).limit(20);
        
        res.render('profile', { title: "Profile", posts });
    },

    postProfile: (req, res, next) => {
        res.send('POST profile');
    },

    updateProfile: async (req, res, next) => {
        // get username and email from body
        const { username, email } = req.body;
        // get user
        const { user } = res.locals;

        if(username)
            user.username = username;
        
        if(email)
            user.email = email;

        if(req.file){
            if(user.image.public_id){
                await cloudinary.uploader.destroy(user.image.public_id);
            }

            const { path, filename } = req.file;

            user.image = { secure_url: path, public_id: filename };
        }
        
        await user.save();

        // promisify is a call back function handler
        const login = util.promisify(req.login.bind(req));

        // login new user
        await login(user);

        req.session.success = "Profile successfully updated!";

        res.redirect('/profile');
    }
};