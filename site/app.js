const homeView = document.querySelector("#home-view");
const locationView = document.querySelector("#location-view");
const locationTitle = document.querySelector("#location-title");
const locationMessage = document.querySelector("#location-message");
const cityparkView = document.querySelector("#citypark-view");
const museumView = document.querySelector("#museum-view");
const toystoreView = document.querySelector("#toystore-view");
const zooView = document.querySelector("#zoo-view");
const cityhallView = document.querySelector("#cityhall-view");
const schoolView = document.querySelector("#school-view");
const townshipView = document.querySelector("#township-view");
const libraryView = document.querySelector("#library-view");

const locations = {};

function showHome() {
  homeView.hidden = false;
  locationView.hidden = true;
  cityparkView.hidden = true;
  museumView.hidden = true;
  toystoreView.hidden = true;
  zooView.hidden = true;
  cityhallView.hidden = true;
  schoolView.hidden = true;
  townshipView.hidden = true;
  libraryView.hidden = true;
  document.title = "KidsTown";
}

function showLocation(location) {
  homeView.hidden = true;
  locationView.hidden = false;
  cityparkView.hidden = true;
  museumView.hidden = true;
  toystoreView.hidden = true;
  zooView.hidden = true;
  cityhallView.hidden = true;
  schoolView.hidden = true;
  townshipView.hidden = true;
  libraryView.hidden = true;

  locationTitle.textContent = location.title;
  locationMessage.textContent = location.message;
  document.title = `${location.title} | KidsTown`;
}

function showCityPark() {
  homeView.hidden = true;
  locationView.hidden = true;
  cityparkView.hidden = false;
  museumView.hidden = true;
  toystoreView.hidden = true;
  zooView.hidden = true;
  cityhallView.hidden = true;
  schoolView.hidden = true;
  townshipView.hidden = true;
  libraryView.hidden = true;
  document.title = "City Park | KidsTown";

  if (window.CityPark) {
    window.CityPark.start();
  }
}

function showMuseum() {
  homeView.hidden = true;
  locationView.hidden = true;
  cityparkView.hidden = true;
  museumView.hidden = false;
  toystoreView.hidden = true;
  zooView.hidden = true;
  cityhallView.hidden = true;
  schoolView.hidden = true;
  townshipView.hidden = true;
  libraryView.hidden = true;
  document.title = "Museum | KidsTown";

  if (window.Museum) {
    window.Museum.start();
  }
}

function showToyStore() {
  homeView.hidden = true;
  locationView.hidden = true;
  cityparkView.hidden = true;
  museumView.hidden = true;
  toystoreView.hidden = false;
  zooView.hidden = true;
  cityhallView.hidden = true;
  schoolView.hidden = true;
  townshipView.hidden = true;
  libraryView.hidden = true;
  document.title = "Toy Store | KidsTown";

  if (window.ToyStore) {
    window.ToyStore.start();
  }
}

function showZoo() {
  homeView.hidden = true;
  locationView.hidden = true;
  cityparkView.hidden = true;
  museumView.hidden = true;
  toystoreView.hidden = true;
  zooView.hidden = false;
  cityhallView.hidden = true;
  schoolView.hidden = true;
  townshipView.hidden = true;
  libraryView.hidden = true;
  document.title = "Zoo | KidsTown";

  if (window.Zoo) {
    window.Zoo.start();
  }
}

function showCityHall() {
  homeView.hidden = true;
  locationView.hidden = true;
  cityparkView.hidden = true;
  museumView.hidden = true;
  toystoreView.hidden = true;
  zooView.hidden = true;
  cityhallView.hidden = false;
  schoolView.hidden = true;
  townshipView.hidden = true;
  libraryView.hidden = true;
  document.title = "City Hall | KidsTown";

  if (window.CityHall) {
    window.CityHall.start();
  }
}

function showSchool() {
  homeView.hidden = true;
  locationView.hidden = true;
  cityparkView.hidden = true;
  museumView.hidden = true;
  toystoreView.hidden = true;
  zooView.hidden = true;
  cityhallView.hidden = true;
  schoolView.hidden = false;
  townshipView.hidden = true;
  libraryView.hidden = true;
  document.title = "School | KidsTown";

  if (window.School) {
    window.School.start();
  }
}

function showTownship() {
  homeView.hidden = true;
  locationView.hidden = true;
  cityparkView.hidden = true;
  museumView.hidden = true;
  toystoreView.hidden = true;
  zooView.hidden = true;
  cityhallView.hidden = true;
  schoolView.hidden = true;
  townshipView.hidden = false;
  libraryView.hidden = true;
  document.title = "Township | KidsTown";

  if (window.Township) {
    window.Township.start();
  }
}

function showLibrary() {
  homeView.hidden = true;
  locationView.hidden = true;
  cityparkView.hidden = true;
  museumView.hidden = true;
  toystoreView.hidden = true;
  zooView.hidden = true;
  cityhallView.hidden = true;
  schoolView.hidden = true;
  townshipView.hidden = true;
  libraryView.hidden = false;
  document.title = "Library | KidsTown";

  if (window.Library) {
    window.Library.start();
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

  if (route === "#/museum") {
    showMuseum();
    return;
  }

  if (route === "#/toy-store") {
    showToyStore();
    return;
  }

  if (route === "#/zoo") {
    showZoo();
    return;
  }

  if (route === "#/city-hall") {
    showCityHall();
    return;
  }

  if (route === "#/school") {
    showSchool();
    return;
  }

  if (route === "#/township") {
    showTownship();
    return;
  }

  if (route === "#/library") {
    showLibrary();
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