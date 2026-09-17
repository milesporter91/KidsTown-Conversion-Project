const homeView = document.querySelector("#home-view");
const locationView = document.querySelector("#location-view");
const locationTitle = document.querySelector("#location-title");
const locationMessage = document.querySelector("#location-message");
const cityparkView = document.querySelector("#citypark-view");

const locations = {
  "#/township": {
    title: "Township",
    message:
      "The Township route is connected. Its history and world-location activities are still being converted."
  },

  "#/museum": {
    title: "Museum",
    message:
      "The Museum route is connected. Its original weather and space activities are still being converted."
  },

  "#/zoo": {
    title: "Zoo",
    message:
      "The Zoo route is connected. Its animal-region activities are still being converted."
  },

  "#/school": {
    title: "School",
    message:
      "The School route is connected. Its word games and learning activities are still being converted."
  },

  "#/city-hall": {
    title: "City Hall",
    message:
      "The City Hall route is connected. Its detective activities are still being converted."
  },

  "#/toy-store": {
    title: "Toy Store",
    message:
      "The Toy Store route is connected. Its puzzles and games are still being converted."
  },

  "#/library": {
    title: "Library",
    message:
      "The Library route is connected. Its state stories and word activities are still being converted."
  }
};

function showHome() {
  homeView.hidden = false;
  locationView.hidden = true;
  cityparkView.hidden = true;
  document.title = "KidsTown";
}

function showLocation(location) {
  homeView.hidden = true;
  locationView.hidden = false;
  cityparkView.hidden = true;

  locationTitle.textContent = location.title;
  locationMessage.textContent = location.message;
  document.title = `${location.title} | KidsTown`;
}

function showCityPark() {
  homeView.hidden = true;
  locationView.hidden = true;
  cityparkView.hidden = false;
  document.title = "City Park | KidsTown";

  if (window.CityPark) {
    window.CityPark.start();
  }
}

function handleRoute() {
  const route = window.location.hash || "#/home";

  if (route === "#/home") {
    showHome();
    return;
  }

  if (route === "#/city-park") {
    showCityPark();
    return;
  }

  const location = locations[route];

  if (location) {
    showLocation(location);
  } else {
    showLocation({
      title: "Location Not Found",
      message: "That KidsTown location does not exist."
    });
  }
}

window.addEventListener("hashchange", handleRoute);
handleRoute();