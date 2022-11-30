const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const moment = require("moment");

const createdAt = function () {
	const d = new Date();
	const formattedDate = moment(d).format("MMM-DD-YYYY");
	return formattedDate;
};

const AvatarSchema = new Schema({
	url: String,
	filename: String
});

AvatarSchema.virtual("avatar").get(function () {
	return this.url.replace("/upload", "/upload/w_100,h_100,c_fill");
});

AvatarSchema.virtual("smallAvatar").get(function () {
	return this.url.replace("/upload", "/upload/w_30,h_30,c_fill");
});
AvatarSchema.virtual("reviewAvatar").get(function () {
	return this.url.replace("/upload", "/upload/w_30,h_30,c_fill,r_max");
});

const UserSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true
		},
		firstName: String,
		lastName: String,
		createdAt: { type: String, default: createdAt },
		avatar: [AvatarSchema]
	},
	{ timestamps: true }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
