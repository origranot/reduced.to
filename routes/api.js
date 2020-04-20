const express = require('express')
const router = express.Router()

const shortnerService = require('../services/shortner');

router.post('/shortner', (req, res) => {
    let { originalUrl } = req.body;

    let shortUrl = shortnerService.getShortUrl(originalUrl);

    if (shortUrl !== null) {
        return res.status(200).json({ newUrl: shortUrl });
    }

    do {
        shortUrl = shortnerService.generateShortUrl();
    } while (!shortnerService.isShortUrlAvailable(shortUrl));

    shortnerService.addUrl(originalUrl, shortUrl);
    return res.status(200).json({ newUrl: shortUrl })
})

module.exports = router;