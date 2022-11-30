$(function () {
	$(document).scroll(function () {
		$nav = $("#mainNavBar");
		$navlink = $(".nav-link");
		$logo = $("#logo");
		let scrolledHeight = $(this).scrollTop();
		if (scrolledHeight > $nav.height()) {
			$logo.attr(
				"src",
				"https://res.cloudinary.com/dlds2z087/image/upload/w_223,h_77/v1669717429/India%20Tour/logo-black_hkvmza.png"
			);
		} else if (scrolledHeight < $nav.height()) {
			$logo.attr(
				"src",
				"https://res.cloudinary.com/dlds2z087/image/upload/w_223,h_77/v1669717428/India%20Tour/logo_uktaii.png"
			);
		}
		$navlink.toggleClass("scrolled", scrolledHeight > $nav.height());
		$nav.toggleClass("scrolled", scrolledHeight > $nav.height());
	});
});
