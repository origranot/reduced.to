const express = require('express')
const router = express.Router()

const shortnerService = require('../services/shortner');

router.post('/shortner', (req, res) => {
    let shortUrl = shortnerService.generateShortUrl();
    console.log(shortnerService.isShortUrlAvailable(shortUrl));
    shortnerService.addUrl(req.body.originalUrl, shortUrl);
    console.log(shortnerService.isShortUrlAvailable(shortUrl));

    console.log(global.URL_DICT);
    res.status(200).json({ newUrl: req.body.originalUrl })
})

module.exports = router;