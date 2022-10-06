import axios from "axios";
/**
 * Handles shortener button click.
 */
export const handleShortenerClick = async () => {
  document.getElementById("loading")!.style.display = "block";
  //@ts-ignore
  const originalUrl = document?.getElementById("urlInput").value;

  const shortenInfo = await getShortenUrl(originalUrl);

  // Remove the loader from the screen
  document.getElementById("loading")!.style.display = "none";

  if (shortenInfo === null) {
    document.getElementById("result")!.textContent = "This url is invalid..";
    return;
  }

  const { newUrl } = shortenInfo;
  document.getElementById("result")!.textContent =
    window.location.href + newUrl;
  document.getElementById("urlAlert")?.classList.add("collapse");
};

/**
 * Returns the shorter link from the server.
 * @param {String} originalUrl - The original url we want to shorten.
 */
const getShortenUrl = async (originalUrl: string) => {
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

/**
 * Copy link to clipboard.
 * @param {HTMLElement} htmlElement - HTML Element containing the short url.
 */
export const copyUrl = async (htmlElement: HTMLElement) => {
  navigator.clipboard.writeText(htmlElement.innerHTML);
  document.getElementById("urlAlert")?.classList.remove("collapse");
};
