const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded())

app.use('/add-product', (req, res, next) => {
    console.log('Adding products')
    res.send('<h3>This is the product page, so please add your product below</h3>')
})

app.

app.use('/', (req, res, next) => {
    console.log('The home page')
    res.send('<h3>This is the home page</h3>')
})