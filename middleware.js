const { placeSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Place = require("./models/places");
const Review = require("./models/review");
const mongoose = require("mongoose");

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		if (!["/login", "/register", "/"].includes(req.originalUrl)) {
			req.session.returnTo = req.originalUrl;
		}
		req.flash("error", "You must be signed in first!");
		return res.redirect("/login");
	}
	next();
};

module.exports.checkReturnTo = (req, res, next) => {
	if (req.session.returnTo) {
		if (req.session.returnTo.includes("reviews")) {
			req.session.returnTo = req.session.returnTo.split("/reviews")[0];
		}
		res.locals.returnTo = req.session.returnTo;
	}
	next();
};
module.exports.validatePlace = (req, res, next) => {
	const { error } = placeSchema.validate(req.body);
	if (error) {
		const msg = error.details.map(el => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const places = await Place.findById(id);
	if (!places.author.equals(req.user._id)) {
		req.flash("error", "You don't have permission to do that!");
		return res.redirect(`/places/${id}`);
	}
	next();
};

module.exports.isExist = async (req, res, next) => {
	const { id } = req.params;
	if (mongoose.Types.ObjectId.isValid(id)) {
		const place = await Place.findById(id);
		res.locals.place = place;
		if (!place) {
			req.flash("error", "Cannot find that campground");
			res.redirect("/places");
		}
		next();
	} else {
		req.flash("error", "That is not a valid campground id");
		res.redirect("/places");
	}
};

module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map(el => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isReviewAuthor = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash("error", "You don't have permission to do that!");
		return res.redirect(`/places/${id}`);
	}
	next();
};
