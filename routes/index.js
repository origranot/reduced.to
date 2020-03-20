const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index');
})

// * 404 route
router.get('*', (req, res) => {
    res.status(404).send('Its 404 you fucker!')
})

module.exports = router;