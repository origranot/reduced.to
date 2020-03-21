require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('view engine', 'pug')

app.use(express.static('public'))
app.use(bodyParser.json())

const indexRoutes = require('./routes/index')
const apiRoutes = require('./routes/api')

app.use('/', indexRoutes)
app.use('/api', apiRoutes)

// Declare Globals
global.URL_DICT = {}

app.listen(process.env.APP_PORT, () => console.log(`App listening on port ${process.env.APP_PORT}!`))