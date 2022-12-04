const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const ImageSchema = new Schema({
	url: String,
	filename: String
});

ImageSchema.virtual("thumbnail").get(function () {
	return this.url.replace("/upload", "/upload/w_278,h_250,c_fill");
});

ImageSchema.virtual("showImg").get(function () {
	return this.url.replace("/upload", "/upload/w_1300,h_700,c_fill");
});
ImageSchema.virtual("smallImg").get(function () {
	return this.url.replace("/upload", "/upload/w_150,h_100,c_fill");
});

const PlaceSchema = new Schema(
	{
		title: { type: String, required: true },
		location: { type: String, required: true },
		Region: String,
		price: { type: Number, min: 0 },
		geometry: {
			type: {
				type: String,
				enum: ["Point"],
				required: true
			},
			coordinates: {
				type: [Number],
				required: true
			}
		},
		images: [ImageSchema],
		description: {
			type: String,
			required: true
		},
		ThingsToDo: String,
		TopDestinations: String,
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
	},
	{ timestamps: true }
);

PlaceSchema.index({ title: "text", location: "text" });

PlaceSchema.post("findOneAndDelete", async function (doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews
			}
		});
	}
});

module.exports = mongoose.model("Place", PlaceSchema);
