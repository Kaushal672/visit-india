const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { checkReturnTo, isLoggedIn, validateUser } = require("../middleware");
const users = require("../controllers/users");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
	.route("/register")
	.get(users.renderRegister)
	.post(upload.array("avatar"), catchAsync(users.createUser));

router
	.route("/login")
	.get(users.renderLogin)
	.post(
		checkReturnTo,
		passport.authenticate("local", {
			failureFlash: true,
			failureRedirect: "/login"
		}),
		users.login
	);

router.get("/logout", isLoggedIn, users.logout);

router
	.route("/user/:id")
	.get(users.userProfile)
	.put(upload.array("avatar"), isLoggedIn, catchAsync(users.updateUser))
	.delete(isLoggedIn, catchAsync(users.deleteImage));

router.get("/user/:id/edit", isLoggedIn, users.renderEditForm);

module.exports = router;
