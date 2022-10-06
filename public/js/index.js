"use strict";

/**
 * Handles shortener button click.
 */
const handleShortenerClick = async () => {
  let originalUrl = document.getElementById("urlInput").value;
  let shortenInfo = await getShortenUrl(originalUrl);

  if (shortenInfo === null) {
    document.getElementById("result").textContent = "This url is invalid..";
    return;
  }

  let { newUrl } = shortenInfo;
  document.getElementById("result").textContent = window.location.href + newUrl;
  //   document.getElementById("urlAlert").classList.add("collapse");
};

/**
 * Returns the shorter link from the server.
 * @param {String} originalUrl - The original url we want to shorten.
 */
const getShortenUrl = async (originalUrl) => {
  let result;
  try {
    result = await axios.post("/api/shortener", {
      originalUrl,
    });
  } catch (err) {
    return null;
  }
  return result.data;
};
const Toast = {
  init() {
    this.hideTimeout = null;

    this.el = document.createElement("div");
    this.el.className = "toast";
    document.body.appendChild(this.el);
  },

  show(message, state) {
    clearTimeout(this.hideTimeout);

    this.el.textContent = message;
    this.el.className = "toast toast--visible";

    if (state) {
      this.el.classList.add(`toast--${state}`);
    }

    this.hideTimeout = setTimeout(() => {
      this.el.classList.remove("toast--visible");
    }, 3000);
  },
};

document.addEventListener("DOMContentLoaded", () => Toast.init());

/**
 * Copy link to clipboard.
 * @param {HTMLElement} htmlElement - HTML Element containing the short url.
 */
const copyUrl = async (htmlElement) => {
  await navigator.clipboard.writeText(htmlElement.innerHTML);
  if (htmlElement.innerHTML !== "This url is invalid..") {
    Toast.show("Your link has been copied to the clipboard!", "success");
  }

  // document.getElementById('urlAlert').classList.remove('collapse');
};
