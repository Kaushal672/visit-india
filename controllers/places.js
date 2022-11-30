const Place = require("../models/places");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });
const moment = require("moment");

module.exports.index = async (req, res) => {
	if (req.query.q) {
		const search = req.query.q;
		const regex = new RegExp(escapeRegex(search), "gi");
		Place.find({ $text: { $search: regex } }, function (err, allPlaces) {
			if (err || !allPlaces.length) {
				req.flash("error", "No place matched your search");
				res.redirect("/places");
			} else {
				res.render("place/searchResult", { places: allPlaces, search });
			}
		});
	} else {
		const northPlaces = await Place.find({ Region: /North/ });
		const southPlaces = await Place.find({ Region: /South/ });
		const topDest = await Place.find({ TopDestinations: "Yes" }).populate("images");
		res.render("place/index", { northPlaces, southPlaces, topDest });
	}
};

module.exports.northPlace = async (req, res) => {
	const northPlaces = await Place.find({ Region: /North/ });
	const northTopDest = await Place.find({ Region: /North/, TopDestinations: "Yes" });
	res.render("place/northplaces", { northPlaces, northTopDest });
};

module.exports.southPlace = async (req, res) => {
	const southPlaces = await Place.find({ Region: /South/ });
	const southTopDest = await Place.find({ Region: /South/, TopDestinations: "Yes" });
	res.render("place/southplaces", { southPlaces, southTopDest });
};

module.exports.renderNewForm = (req, res) => {
	res.render("place/new");
};

module.exports.createPlace = async (req, res) => {
	const goeData = await geoCoder
		.forwardGeocode({
			query: req.body.place.location + "," + req.body.place.title,
			limit: 1
		})
		.send();
	const place = new Place(req.body.place);
	place.geometry = goeData.body.features[0].geometry;
	place.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
	place.author = req.user._id;
	await place.save();
	req.flash("success", "Successfully made a tourist place");
	res.redirect(`/places/${place._id}`);
};

module.exports.renderShowPage = async (req, res) => {
	const { id } = req.params;
	const place = await Place.findById(id)
		.populate({
			path: "reviews",
			populate: {
				path: "author"
			}
		})
		.populate("author");
	let reviewPostTime = [];
	for (review of place.reviews) {
		reviewPostTime.push(moment(review.createdAt).fromNow());
	}
	const placePostTime = moment(place.createdAt).fromNow();
	res.render("place/show", { place, placePostTime, reviewPostTime });
};

module.exports.renderUpdateForm = async (req, res) => {
	const place = res.locals.place;
	res.render("place/edit", { place });
};

module.exports.updatePlace = async (req, res) => {
	const { id } = req.params;
	const goeData = await geoCoder
		.forwardGeocode({
			query: req.body.place.location + "," + req.body.place.title,
			limit: 1
		})
		.send();
	const place = await Place.findByIdAndUpdate(id, { ...req.body.place });
	place.geometry = goeData.body.features[0].geometry;
	const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
	place.images.push(...imgs);
	await place.save();
	if (req.body.deleteImages && place.images.length > req.body.deleteImages.length) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await place.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
	} else if (req.body.deleteImages && place.images.length <= req.body.deleteImages.length) {
		req.flash("error", "Cannot delete every image!");
		return res.redirect(`/places/${place._id}`);
	}
	req.flash("success", "Successfully updated tourist place");
	res.redirect(`/places/${place._id}`);
};

module.exports.deletePlace = async (req, res) => {
	const { id } = req.params;
	const places = await Place.findById(id);
	if (!places.author.equals(req.user._id)) {
		req.flash("error", "You don't have permission to do that!");
		return res.redirect(`/places/${id}`);
	}
	for (let place of Object.keys(places.images)) {
		await cloudinary.uploader.destroy(places.images[place].filename);
	}
	const place = await Place.findByIdAndDelete(id);
	req.flash("success", "Successfully deleted tourist place");
	res.redirect(`/places`);
};

module.exports.buyRender = async (req, res) => {
	const { id } = req.params;
	const places = await Place.findById(id);
	res.render("place/buy", { places });
};

module.exports.buyPlace = (req, res) => {
	const { id } = req.params;
	req.flash("success", "Thank you for your purchase!");
	res.redirect(`/places/${id}`);
};

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
