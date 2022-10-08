"use strict";

let invalidUrl = false;

const handleShortenerKeypress = (event) => {
  if (event.keyCode === 13) {
    handleShortenerClick();
  }
};

/**
 * Handles shortener button click.
 */
const handleShortenerClick = async () => {
  const result = document.getElementById("result");
  const loader = document.getElementById("loading");
  const urlInput = document.getElementById("urlInput");

  loader.style.display = "block";
  result.style.display = "none";

  invalidUrl = false;

  const { newUrl } = await getShortenUrl(urlInput.value);

  // Remove the loader from the screen
  loader.style.display = "none";
  result.style.display = "block";

  urlInput.value = "";

  if (!newUrl) {
    result.querySelector("#error").textContent = "This url is invalid..";
    result.querySelector("#text").textContent = "";
    result.querySelector("#action").classList = "d-none";
    invalidUrl = true;
    return;
  }

  result.querySelector("#error").textContent = "";
  result.querySelector("#text").textContent = window.location.href + newUrl;
  result.querySelector("#action").classList.replace("d-none", "d-block");

  copyUrl();
};

/**
 * Returns the shorter link from the server.
 * @param {String} originalUrl - The original url we want to shorten.
 */
const getShortenUrl = async (originalUrl) => {
  let result;
  try {
    result = await fetch("/api/v1/shortener", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalUrl }),
    });
  } catch (err) {
    return null;
  }
  return result.json();
};

/**
 * Copy link to clipboard.
 */

const copyUrl = () => {
  if (invalidUrl) {
    return;
  }

  const result = document.querySelector("#result #text");
  navigator.clipboard.writeText(result.textContent);
  toastAlert();
};

const toastAlert = (timeoutInMiliseconds = 2000) => {
  const urlAlert = document.getElementById("urlAlert");

  urlAlert.classList.add("fade-in");
  urlAlert.classList.remove("collapse");

  setTimeout(() => {
    urlAlert.classList.remove("fade-in");
    urlAlert.classList.add("fade-out");

    setTimeout(() => {
      urlAlert.classList.add("collapse");
      urlAlert.classList.remove("fade-out");
    }, 500);
  }, timeoutInMiliseconds);
};

// Open link in a new window/tab.
const openLink = () => {
  const text = document.querySelector("#result #text").textContent;
  window.open(text, "_blank");
};

// toggle dark mode
const LOCAL_STORAGE_KEY = "url-shorterner-theme";

const setIcon = (theme) => {
  const button = document.getElementById("toggle-theme");
  const toLightIcon = `<i class="bi bi-brightness-high"></i>`;
  const toDarkIcon = `<i class="bi bi-moon"></i>`;

  button.innerHTML = theme === "dark" ? toLightIcon : toDarkIcon;
};

const insertWaves = (theme) => {
  const waveContainer = document.getElementById("wave-container");

  const darkThemeColors = {
    0: "rgba(255, 255, 255, 0.7)",
    3: "rgba(255, 255, 255, 0.5)",
    5: "rgba(255, 255, 255, 0.3)",
    7: "#fff",
  };

  const lightThemeColors = {
    0: "rgba(20, 20, 20, 0.7)",
    3: "rgba(20, 20, 20, 0.5)",
    5: "rgba(20, 20, 20, 0.3)",
    7: "#222",
  };

  const colors = theme === "dark" ? darkThemeColors : lightThemeColors;

  const svgElement = `<svg class="waves" id="svg-waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewbox="0 24 150 28" preserveaspectratio="none" shape-rendering="auto">
	<defs>
	  <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
	</defs>
	<g class="parallax">
	  <use xlink:href="#gentle-wave" x="48" y="0" fill="${colors[0]}"></use>
	  <use xlink:href="#gentle-wave" x="48" y="3" fill="${colors[3]}"></use>
	  <use xlink:href="#gentle-wave" x="48" y="5" fill="${colors[5]}"></use>
	  <use xlink:href="#gentle-wave" x="48" y="7" fill="${colors[7]}"></use>
	</g>
  </svg>`;

  waveContainer.innerHTML = svgElement;
};

window.onload = () => {
  const currentTheme = localStorage.getItem(LOCAL_STORAGE_KEY) || "dark";
  document.body.setAttribute("data-theme", currentTheme);
  setIcon(currentTheme);
  insertWaves(currentTheme);
};

const toggleTheme = () => {
  const currentTheme = localStorage.getItem(LOCAL_STORAGE_KEY) || "dark";
  const theme = currentTheme === "light" ? "dark" : "light";
  setIcon(theme);
  insertWaves(theme);
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem(LOCAL_STORAGE_KEY, theme);
};
