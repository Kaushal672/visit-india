const firstImg = document.querySelector(".firstImg").getAttribute("src");
const secondImg = document.querySelector(".secondImg").getAttribute("src");
const thirdImg = document.querySelector(".thirdImg").getAttribute("src");

const swiper = new Swiper(".swiper", {
	loop: true,
	preventClicks: true,
	preventInteractionOnTransition: true,
	autoplay: {
		delay: 8000
	},
	speed: 1000,
	allowTouchMove: false,
	on: {
		imagesReady: function () {
			const activeSlide = document.querySelector("#firstSlide");
			const imageTitle = activeSlide
				.querySelector(".image_description")
				.querySelector(".image_title");
			const imageSlogan = activeSlide
				.querySelector(".image_description")
				.querySelector(".image_slogan");
			const imageDesc = activeSlide.querySelector(".image_description");
			activeSlide.classList.add("bgcolor");
			toggleClass();
			function toggleClass() {
				setTimeout(() => {
					imageTitle.classList.add("animate__fadeInDown");
					imageSlogan.classList.add("animate__fadeInUp");
					imageDesc.classList.add("showText");
				}, 1800);
			}
		}
	}
});

swiper.on("slideChangeTransitionStart", function () {
	const currentSlideContainer = document.querySelector(".slider_container");
	if (swiper.realIndex === 0) currentSlideContainer.style.backgroundImage = `url(${firstImg})`;
	if (swiper.realIndex === 1) currentSlideContainer.style.backgroundImage = `url(${secondImg})`;
	if (swiper.realIndex === 2) currentSlideContainer.style.backgroundImage = `url(${thirdImg})`;
	const activeSlide = document.querySelector(".swiper-slide-active");
	const imageTitle = activeSlide.querySelector(".image_description").querySelector(".image_title");
	const imageSlogan = activeSlide
		.querySelector(".image_description")
		.querySelector(".image_slogan");
	const imageDesc = activeSlide.querySelector(".image_description");
	toggleClass();

	function toggleClass() {
		setTimeout(() => {
			imageTitle.classList.add("animate__fadeInDown");
			imageSlogan.classList.add("animate__fadeInUp");
			imageDesc.classList.add("showText");
		}, 1800);
	}
	const prevSlide = document.querySelector(".swiper-slide-prev");
	const nextSlide = document.querySelector(".swiper-slide-next");
	activeSlide.classList.add("bgcolor");
	toggleClass();
	prevSlide.classList.remove("bgcolor");
	nextSlide.classList.remove("bgcolor");
	prevSlide
		.querySelector(".image_description")
		.querySelector(".image_title")
		.classList.remove("animate__fadeInDown");
	prevSlide
		.querySelector(".image_description")
		.querySelector(".image_slogan")
		.classList.remove("animate__fadeInUp");
	prevSlide.querySelector(".image_description").classList.remove("showText");
	nextSlide
		.querySelector(".image_description")
		.querySelector(".image_title")
		.classList.remove("animate__fadeInDown");
	nextSlide
		.querySelector(".image_description")
		.querySelector(".image_slogan")
		.classList.remove("animate__fadeInUp");
	nextSlide.querySelector(".image_description").classList.remove("showText");
});
