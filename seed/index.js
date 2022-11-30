const mongoose = require("mongoose");
require("dotenv").config();
const Place = require("../models/places");
const places = require("./places");

main().catch(err => console.log("Error", err));

async function main() {
	await mongoose.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		family: 4
	});
	console.log("Database connected");
}

const seedDB = async () => {
	await Place.deleteMany({});
	for (let i = 0; i < 72; i++) {
		const j = places[i].images.length;
		const place = new Place({
			author: "6385bd5e6623d2a37c8e5b40",
			title: places[i].Name,
			location: places[i].location,
			description: places[i].description,
			images: places[i].images,
			geometry: {
				type: "Point",
				coordinates: [places[i].longitude, places[i].latitude]
			},
			ThingsToDo: places[i].ThingsToDo,
			TopDestinations: places[i].TopDestinations,
			Region: places[i].Region,
			price: places[i].price
		});
		await place.save();
	}
};
seedDB().then(() => {
	mongoose.connection.close();
});
