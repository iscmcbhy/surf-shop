const faker = require("faker");
const Post = require("./models/postModel");
const paginate = require("mongoose-paginate");

async function seedPosts(){
    await Post.remove({});

    for(const i of new Array(40)) {
        const post = {
            title: faker.lorem.word(),
            description: faker.lorem.text(),
            author: {
                _id: "61b856dbc746f384e1236dfc",
                username: "testUser"
            }
        }

        await Post.create(post);
    }

    console.log("40 new posts created!");
}

module.exports = {
    seedPosts
}