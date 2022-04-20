const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviewModel");
const paginate = require("mongoose-paginate");

const PostSchema = new Schema({
    title: String,
    description: String,
    price: String,
    images: [ 
        {
            url: String, 
            public_id: String
        } 
    ],
    location: String,
    coordinates: Array,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    avgRating : {
        type: Number,
        default: 0
    }
});

PostSchema.pre("remove", async function() {
    await Review.remove({
        _id: {
            $in: this.reviews
        }
    });
});

PostSchema.methods.calculateAverageRating = function (){
    let totalRatings = 0;
    if(this.reviews.length){
        this.reviews.forEach(review => {
            totalRatings += review.rating;
        });

        this.avgRating = Math.round((totalRatings / this.reviews.length) * 10 ) / 10;
    } else {
        this.avgRating = totalRatings;
    }

    const  floorRating = Math.floor(this.avgRating);
    
    this.save();

    return floorRating;
}

PostSchema.plugin(paginate);

module.exports = mongoose.model("Post", PostSchema);