const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const { cloudinary } = require('../cloudinary');
const mapboxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapBoxToken = process.env.MAPBOX_ACCESS_TOKEN;
const geocodingClient = mapboxGeocoding({ accessToken: mapBoxToken });

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const middleware = {

    // Error Handler
    asyncErrorHandler: (fn) => (req, res, next) => {
        Promise.resolve(fn(req, res, next))
                .catch(next);
    },

    isReviewAuthor: async (req, res, next) => {
        let review = await Review.findById(req.params.review_id);

        if(review.author.equals(req.user._id)){
            res.locals.review = review;
            return next();
        }

        req.session.error = "Unauthorized Access!";
        res.redirect('back');
    },

    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        }

        req.session.error = 'You are currently logged out!';
		req.session.redirectTo = req.originalUrl;

		res.redirect('/login');
    },

    isPostAuthor: async (req, res, next) => {
        const post = await Post.findById(req.params.id);

        if(post.author.equals(req.user._id)){
            res.locals.post = post;
            return next();
        }

        req.session.error = "Access Denied!";
        res.redirect('back');
    },

    isValidPassword: async (req, res, next) => {
        // Authenticate user
        // High Order Function
        const { user } = await User.authenticate()(req.user.username, req.body.currentPassword);

        if(user){
            // add user to locals 
            res.locals.user = user;
            
            next();
        } else {
            // // Deletes image from cloudinary
            middleware.deleteProfileImage(req);

            req.session.error = "Incorrect Current Password!";

            return res.redirect('/profile');
        }
    },

    changePassword: async (req, res, next) => {
        // Destructuer passwords from form body
        const {
            newPassword,
            confirmPassword
        } = req.body;

        if(newPassword && confirmPassword){
            // get user by destructuring res.locals
            const { user } = res.locals;

            // check if valid
            if(newPassword && !confirmPassword){
                // Deletes image from cloudinary
                middleware.deleteProfileImage(req);

                req.session.error = 'Missing password confirmation!';
		        return res.redirect('/profile');
            } else if(newPassword === confirmPassword){
                // set new password
                await user.setPassword(newPassword);

                next();
            } else {
                // Deletes image from cloudinary
                middleware.deleteProfileImage(req);

                // flash error
                req.session.error = "New and Confirm password mismatch!";

                return res.redirect('/profile')
            }

        } else {
            next();
        }
    },

    deleteProfileImage: async req => {
        if(req.file) await cloudinary.uploader.destroy(req.file.public_id);
    },

    async searchAndFilterPosts(req, res , next){
        // pull keys from req.query (if there are any) and assign them 
        // to queryKeys variable as an array of string values
        const queryKeys = Object.keys(req.query);
        /* 
            check if queryKeys array has any values in it
            if true then we know that req.query has properties
            which means the user:
            a) clicked a paginate button (page number)
            b) submitted the search/filter form
            c) both a and b
        */
        if (queryKeys.length) {
            // initialize an empty array to store our db queries (objects) in
            const dbQueries = [];
            // destructure all potential properties from req.query
            let { search, price, avgRating, location, distance  } = req.query;
            // check if search exists, if it does then we know that the user
            // submitted the search/filter form with a search query
            if (search) {
                // convert search to a regular expression and 
                // escape any special characters
                search = new RegExp(escapeRegExp(search), 'gi');
                // create a db query object and push it into the dbQueries array
                // now the database will know to search the title, description, and location
                // fields, using the search regular expression
                dbQueries.push({ $or: [
                    { title: search },
                    { description: search },
                    { location: search }
                ]});
            }
            // check if location exists, if it does then we know that the user
            // submitted the search/filter form with a location query
            if (location) {

                let coordinates;

                try {
                    location = JSON.parse(location);
                    coordinates = location;
                } catch (err) {
                    // geocode the location to extract geo-coordinates (lat, lng)
                    const response = await geocodingClient
                    .forwardGeocode({
                        query: location,
                        limit: 1
                    })
                    .send();
    
                    // destructure coordinates [ <longitude> , <latitude> ]
                    coordinates = response.body.features[0].geometry.coordinates;
                }
                // get the max distance or set it to 25 mi
                let maxDistance = distance || 25;
                // we need to convert the distance to meters, one mile is approximately 1609.34 meters
                maxDistance *= 1609.34;
                // create a db query object for proximity searching via location (geometry)
                // and push it into the dbQueries array
                dbQueries.push({
                geometry: {
                    $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates
                    },
                    $maxDistance: maxDistance
                    }
                }
                });
            }
            // check if price exists, if it does then we know that the user
            // submitted the search/filter form with a price query (min, max, or both)
            if (price) {
                /*
                    check individual min/max values and create a db query object for each
                    then push the object into the dbQueries array
                    min will search for all post documents with price
                    greater than or equal to ($gte) the min value
                    max will search for all post documents with price
                    less than or equal to ($lte) the min value
                */
                if (price.min) dbQueries.push({ price: { $gte: price.min } });
                if (price.max) dbQueries.push({ price: { $lte: price.max } });
            }
            // check if avgRating exists, if it does then we know that the user
            // submitted the search/filter form with a avgRating query (0 - 5 stars)
            if (avgRating) {
                // create a db query object that finds any post documents where the avgRating
                // value is included in the avgRating array (e.g., [0, 1, 2, 3, 4, 5])
                dbQueries.push({ avgRating: { $in: avgRating } });
            }

            // pass database query to next middleware in route's middleware chain
            // which is the postIndex method from /controllers/postsController.js
            res.locals.dbQuery = dbQueries.length ? { $and: dbQueries } : {};
        }
        // pass req.query to the view as a local variable to be used in the searchAndFilter.ejs partial
        // this allows us to maintain the state of the searchAndFilter form
        res.locals.query = req.query;

        // build the paginateUrl for paginatePosts partial
        // first remove 'page' string value from queryKeys array, if it exists
        queryKeys.splice(queryKeys.indexOf('page'), 1);
        /*
            now check if queryKeys has any other values, if it does then we know the user submitted the search/filter form
            if it doesn't then they are on /posts or a specific page from /posts, e.g., /posts?page=2
            we assign the delimiter based on whether or not the user submitted the search/filter form
            e.g., if they submitted the search/filter form then we want page=N to come at the end of the query string
            e.g., /posts?search=surfboard&page=N
            but if they didn't submit the search/filter form then we want it to be the first (and only) value in the query string,
            which would mean it needs a ? delimiter/prefix
            e.g., /posts?page=N
            *N represents a whole number greater than 0, e.g., 1
        */
        const delimiter = queryKeys.length ? '&' : '?';
        // build the paginateUrl local variable to be used in the paginatePosts.ejs partial
        // do this by taking the originalUrl and replacing any match of ?page=N or &page=N with an empty string
        // then append the proper delimiter and page= to the end
        // the actual page number gets assigned in the paginatePosts.ejs partial
        res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;
        // move to the next middleware (postIndex method)
        next();
    },

    async searchAndFilterPosts2(req, res, next){
        const queryKeys = Object.keys(req.query);
        
        if(queryKeys.length){
            const dbQueries = [];
            let { search, price, avgRating, location, distance } = req.query;
            
            if(search){
                search = new RegExp(escapeRegExp(search), 'gi');
                dbQueries.push({
                    $or: [
                        { title: search },
                        { description: search },
                        { location: search }
                    ]
                });
            }

            if(location) {
                let coordinates;

                try {
                    location = JSON.parse(location);
                    coordinates = location;
                } catch (err) {
                    const response = await geocodingClient.forwardGeocode({
                        query: location,
                        limit: 1
                    }).send();
    
                    coordinates = response.body.features[0].geometry.coordinates;
                }

                let maxDistance = distance || 25;
                maxDistance *= 1609.34;

                dbQueries.push({
                    geometry: {
                        $near: {
                            $geometry: {
                                type: 'Point',
                                coordinates
                            },
                            $maxDistance: maxDistance
                        }
                    }
                });

            }

            if(price) {
                if(price.min) dbQueries.push({ price: { $gte: price.min } });
                if(price.max) dbQueries.push({ price: { $lte: price.max } });
            }

            if(avgRating) {
                dbQueries.push({ avgRating: { $in: avgRating } });
            }

            res.locals.dbQuery = dbQueries.length ? { $and: dbQueries } : {};
        }

        res.locals.query = req.query;

        queryKeys.splice( queryKeys.indexOf('page'), 1 );

        const delimiter = queryKeys.length ? '&' : '?';

        res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '' ) + `${delimiter}page=`;

        next();
    }
};

module.exports = middleware;