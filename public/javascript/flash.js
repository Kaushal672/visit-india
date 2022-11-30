const el = document.querySelector(".close_btn");
const show = document.querySelector(".alerts");

if (show) {
	function close() {
		show.classList.remove("show");
		show.classList.add("hide");
		setTimeout(() => {
			show.classList.add("hideAlert");
		}, 1000);
	}
	setTimeout(() => {
		show.classList.remove("show");
		show.classList.add("hide");
	}, 5000);
	setTimeout(() => {
		show.classList.add("hideAlert");
	}, 6000);

	el.addEventListener("click", close);
}
