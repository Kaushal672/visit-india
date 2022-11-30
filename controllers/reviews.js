const Review = require('../models/review');
const Place = require('../models/places');

module.exports.createReview = async (req, res) => {
	const { id } = req.params;
	const place = await Place.findById(id);
	const review = new Review(req.body.review);
	review.author = req.user._id;
	place.reviews.push(review);
	await review.save();
    await place.save();
	res.redirect(`/places/${id}`);
};

module.exports.deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'Successfully deleted review');
	res.redirect(`/places/${id}`);
};
