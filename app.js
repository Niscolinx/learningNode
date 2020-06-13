const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded())

app.use('/add-product', (req, res, next) => {
    console.log('Adding products')
    
})