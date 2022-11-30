mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: "map", // container ID
	style: "mapbox://styles/mapbox/outdoors-v11", // style URL
	center: place.geometry.coordinates, // starting position [lng, lat]
	zoom: 12, // starting zoom
	projection: "globe" // display the map as a 3D globe
});
map.on("style.load", () => {
	map.setFog({}); // Set the default atmosphere style
});

new mapboxgl.Marker({ color: "red" })
	.setLngLat(place.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 30 }).setHTML(`<h5>${place.title}</h5><p>${place.location}</p>`)
	)
	.addTo(map);
