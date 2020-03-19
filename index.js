require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.static('public'));

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(process.env.APP_PORT, () => console.log(`Example app listening on port ${process.env.APP_PORT}!`))