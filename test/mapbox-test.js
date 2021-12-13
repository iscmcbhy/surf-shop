require("dotenv").config();
const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = geocoding({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

geocodingClient
// Start
    .forwardGeocode({
        query: "Paris, France",
        limit: 2
    })
    .send()
    .then(response =>{
        const match = response.body;
        console.log(match);
    });
// End