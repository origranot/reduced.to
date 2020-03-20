const express = require('express')
const router = express.Router()

router.post('/shortner', (req, res) => {
    res.status(200).json({ newUrl: req.body.originalUrl })
})

module.exports = router;