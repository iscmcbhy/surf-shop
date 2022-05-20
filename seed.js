const faker = require("faker");
const Post = require("./models/postModel");
const paginate = require("mongoose-paginate");
const Cities = require("./cities.js");

async function seedPosts() {
	await Post.remove({});
	for(const i of new Array(600)) {
		const random1000 = Math.floor(Math.random() * 1000);
		const title = faker.lorem.word();
		const description = faker.lorem.text();
		const postData = {
			title,
			description,
			location: `${Cities[random1000].city}, ${Cities[random1000].state}`,
			geometry: {
				type: 'Point',
				coordinates: [Cities[random1000].longitude, Cities[random1000].latitude],
			},
			author: "6215d791ea6edfac7c5ce5d1",
			price: 1000
		}
		let post = new Post(postData);
		post.properties.description = `<strong><a href="/posts/${post._id}">${title}</a></strong><p>${post.location}</p><p>${description.substring(0, 20)}...</p>`;
		await post.save();
	}
	console.log('600 new posts created');
}

module.exports =  {seedPosts};