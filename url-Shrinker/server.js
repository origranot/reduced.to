const express = require('express')
const  mongoose  = require('mongoose')
const shortUrl = require('./models/shortUrl')
const ShortUrl = require('./models/shortUrl')

const app = express()
mongoose.connect('mongodb://localhost/URL-Shortener', {
     useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))

app.get('/', async (req,res)=> {
    const shortUrls = await ShortUrl.find()
    res.render('index', {shortUrls: shortUrls})
})

app.post('/ShortUrls', async (req,res) => {
await shortUrl.create({full: req.body.fullUrl})
res.redirect('/')
})

app.get('/:shortUrl', async(req,res) =>{
   const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl})
   if (shortUrl == null) return res.sendStatus(404)

   shortUrl.clicks++
   shortUrl.save()

    res.redirect(shortUrl.full)
   
}) 
app.listen(process.env.PORT || 5000);