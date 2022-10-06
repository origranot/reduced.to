const express = require("express");
const router = express.Router();

const shortenerService = require("../services/shortener");

function removeHttp(url) {
  if (url.startsWith("https://")) {
    const https = "https://";
    return url.slice(https.length);
  }

  if (url.startsWith("http://")) {
    const http = "http://";
    return url.slice(http.length);
  }

  return url;
}

router.post("/shortener", (req, res) => {
  let { originalUrl } = req.body;

  if (
    !originalUrl.startsWith("http://") ||
    originalUrl.startsWith("https://")
  ) {
    originalUrl = "https://" + removeHttp(originalUrl);
  }

  try {
    originalUrl = new URL({ toString: () => originalUrl });
  } catch (err) {
    return res.status(404).json({ error: "Invalid url" });
  }

  let shortUrl = shortenerService.getShortUrl(originalUrl.href);

  if (shortUrl !== null) {
    return res.status(200).json({ newUrl: shortUrl });
  }

  do {
    shortUrl = shortenerService.generateShortUrl();
  } while (!shortenerService.isShortUrlAvailable(shortUrl));

  shortenerService.addUrl(originalUrl.href, shortUrl);
  return res.status(200).json({ newUrl: shortUrl });
});

module.exports = router;
