const User = require("../models/user");
const passport = require("passport");
const { cloudinary } = require("../cloudinary");
const Place = require("../models/places");

module.exports.renderRegister = (req, res) => {
	if (req.isAuthenticated()) {
		req.flash("error", "You have to logout to register.");
		return res.redirect("/places");
	}
	res.render("user/register");
};

module.exports.createUser = async (req, res) => {
	try {
		const { email, username, password, firstname, lastname } = req.body;
		const user = new User({ email, username });
		user.firstName = firstname;
		user.lastName = lastname;
		if (req.files.length) {
			user.avatar = req.files.map(f => ({ url: f.path, filename: f.filename }));
		} else {
			user.avatar = {
				url: "https://res.cloudinary.com/dlds2z087/image/upload/v1669354509/India%20Tour/default_avatar_fbyzfp.jpg",
				filename: "India Tour/default_avatar_fbyzfp"
			};
		}
		const registeredUser = await User.register(user, password);
		await user.save();
		req.login(registeredUser, err => {
			if (err) return next(err);
			req.flash("success", `Welcome To Visit India, ${user.username}`);
			res.redirect("/places");
		});
	} catch (e) {
		req.flash("error", e.message);
		res.redirect("/register");
	}
};

module.exports.renderLogin = (req, res) => {
	if (req.isAuthenticated()) {
		req.flash("error", "You are already logged in.");
		return res.redirect("/places");
	}
	res.render("user/login");
};

module.exports.login = (req, res) => {
	const redirectUrl = res.locals.returnTo || "/places";
	delete req.session.returnTo;
	req.flash("success", `Welcome Back! ${req.user.username}`);
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
	req.logOut(function (err) {
		if (err) {
			return next(err);
		}
		req.flash("success", "Logged out");
		res.redirect("/places");
	});
};

module.exports.userProfile = async (req, res) => {
	const user = await User.findById(req.params.id);
	const Places = await Place.find({ author: user._id });
	res.render("user/profile", { user, Places });
};

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const user = await User.findById(id);
	if (user._id.equals(req.user._id)) {
		res.render("user/edit", { user });
	} else {
		req.flash("error", "You don't have permission to do that");
		res.redirect(`/user/${id}`);
	}
};
module.exports.updateUser = async (req, res) => {
	const { id } = req.params;
	if (id === "" + req.user._id) {
		const user = await User.findByIdAndUpdate(id, { ...req.body.User });
		if (req.files.length) {
			user.avatar = req.files.map(f => ({ url: f.path, filename: f.filename }));
		}
		await user.save();
		req.session.passport.user = req.body.User.username;
		req.flash("success", "Successfully updated profile");
		res.redirect(`/user/${user._id}`);
	} else {
		req.flash("error", "You don't have permission to do that");
		res.redirect(`/user/${id}`);
	}
};

module.exports.deleteImage = async (req, res) => {
	const { id } = req.params;
	const user = await User.findById(id);
	if (!user._id.equals(req.user._id)) {
		req.flash("error", "You don't have permission to do that!");
		return res.redirect(`/user/${id}`);
	}
	await cloudinary.uploader.destroy(user.avatar[0].filename);
	user.avatar = {
		url: "https://res.cloudinary.com/dlds2z087/image/upload/v1669354509/India%20Tour/default_avatar_fbyzfp.jpg",
		filename: "India Tour/default_avatar_fbyzfp"
	};
	user.save();
	req.flash("success", "Successfully deleted profile picture");
	res.redirect(`/user/${id}`);
};
