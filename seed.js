const faker = require("faker");
const Post = require("./models/postModel");
const Cities = require("./cities.js");

async function seedPosts() {

	await Post.deleteMany({});

	for(const i of new Array(600)) {
		const random1000 = Math.floor(Math.random() * 1000);
		const title = faker.lorem.word();
		const description = faker.lorem.text();
		const random5 = Math.floor(Math.random() * 6);

		const postData = {
			title,
			description,
			location: `${Cities[random1000].city}, ${Cities[random1000].state}`,
			geometry: {
				type: 'Point',
				coordinates: [Cities[random1000].longitude, Cities[random1000].latitude],
			},
			author: "62987a24cd70806691bc7ce2",
			price: random1000,
			avgRating: random5
		};

		let post = new Post(postData);

		post.properties.description = `<strong><a href="/posts/${post._id}">${title}</a></strong><p>${post.location}</p><p>${description.substring(0, 20)}...</p>`;
		
		await post.save();
	}
	console.log('600 new posts created');
}

module.exports =  {seedPosts};