const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const places = require("../controllers/places");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage: storage, limits: { fileSize: 4194304, files: 3 } });
const { isLoggedIn, validatePlace, isAuthor, isExist } = require("../middleware");

router
	.route("/")
	.get(catchAsync(places.index))
	.post(isLoggedIn, upload.array("image"), validatePlace, catchAsync(places.createPlace));

router.get("/new", isLoggedIn, places.renderNewForm);

router.route("/northplace").get(catchAsync(places.northPlace));
router.route("/southplace").get(catchAsync(places.southPlace));

router
	.route("/:id")
	.get(isExist, catchAsync(places.renderShowPage))
	.put(
		isLoggedIn,
		isExist,
		isAuthor,
		upload.array("image"),
		validatePlace,
		catchAsync(places.updatePlace)
	)
	.delete(isLoggedIn, isExist, isAuthor, catchAsync(places.deletePlace))
	.post(isLoggedIn, places.buyPlace);

router.get("/:id/edit", isLoggedIn, isExist, isAuthor, catchAsync(places.renderUpdateForm));
router.get("/:id/buy", isLoggedIn, isExist, catchAsync(places.buyRender));

module.exports = router;
