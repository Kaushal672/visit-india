if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const ExpressError = require("./utils/ExpressError");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const userRoutes = require("./routes/users");
const placesRoutes = require("./routes/places");
const reviewsRoutes = require("./routes/reviews");
const MongoStore = require("connect-mongo");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/india-tour";
main().catch(err => console.log("Error", err));

async function main() {
	await mongoose.connect(dbUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		family: 4
	});
	console.log("Database connected");
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(mongoSanitize());

const flash = require("connect-flash");
const secret = process.env.SECRET || "mysecret";
const store = MongoStore.create({
	mongoUrl: dbUrl,
	touchAfter: 24 * 60 * 60,
	crypto: {
		secret
	},
	mongoOptions: {
		family: 4
	}
});

store.on("error", function (e) {
	console.log("Session store error", e);
});

const sessionConfig = {
	name: "sessionname",
	secret,
	store,
	resave: false,
	saveUninitialized: true,
	proxy: true,
	cookie: {
		httpOnly: true,
		secure: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(helmet());

const scriptSrcUrls = [
	"https://stackpath.bootstrapcdn.com",
	"https://api.tiles.mapbox.com",
	"https://api.mapbox.com",
	"https://kit.fontawesome.com",
	"https://cdnjs.cloudflare.com",
	"https://cdn.jsdelivr.net",
	"https://code.jquery.com"
];
const styleSrcUrls = [
	"https://kit.fontawesome.com",
	"https://cdn.jsdelivr.net",
	"https://api.tiles.mapbox.com",
	"https://fonts.googleapis.com",
	"https://use.fontawesome.com",
	"https://cdnjs.cloudflare.com"
];
const connectSrcUrls = [
	"https://api.mapbox.com",
	"https://a.tiles.mapbox.com",
	"https://b.tiles.mapbox.com",
	"https://events.mapbox.com",
	"https://ka-f.fontawesome.com"
];
const fontSrcUrls = ["https://fonts.gstatic.com", "https://ka-f.fontawesome.com"];
const formActionSrc = ["https://formsubmit.co"];
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", "blob:"],
			childSrc: ["blob:"],
			objectSrc: [],
			formAction: ["'self'", ...formActionSrc],
			imgSrc: [
				"'self'",
				"blob:",
				"data:",
				"https://res.cloudinary.com/dlds2z087/",
				"https://images.unsplash.com"
			],
			fontSrc: ["'self'", "data:", ...fontSrcUrls]
		}
	})
);

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.use("/", userRoutes);
app.use("/places", placesRoutes);
app.use("/places/:id/reviews", reviewsRoutes);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.render("home");
});

app.all("*", (req, res, next) => {
	next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "Something went wrong, Try again!";
	res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`serving on port ${3000}`);
});
