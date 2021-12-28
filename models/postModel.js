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
    ]
});

PostSchema.pre("remove", async function() {
    await Review.remove({
        _id: {
            $in: this.reviews
        }
    });
});

PostSchema.plugin(paginate);

module.exports = mongoose.model("Post", PostSchema);