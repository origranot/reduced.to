const express = require('express')
const url = require('url')
const router = express.Router()

const shortnerService = require('../services/shortner');

router.post('/shortner', (req, res) => {
    let { originalUrl } = req.body;

    try { 
        originalUrl = new URL({ toString: () => originalUrl })
    } catch (err) { 
        return res.status(404).json({ error: "Invalid url" });
    }

    let shortUrl = shortnerService.getShortUrl(originalUrl.href);

    if (shortUrl !== null) {
        return res.status(200).json({ newUrl: shortUrl });
    }

    do {
        shortUrl = shortnerService.generateShortUrl();
    } while (!shortnerService.isShortUrlAvailable(shortUrl));

    shortnerService.addUrl(originalUrl.href, shortUrl);
    return res.status(200).json({ newUrl: shortUrl })
})

module.exports = router;