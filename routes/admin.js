const path = require('path')

const express = require('express')
const router = express.Router()

const rootDir = require('../path')

const products = []


router.get('/add-product', (req, res, next) => {
    console.log('Adding products')
   // res.sendFile(path.join(rootDir, 'views', 'add-product_copy.html'))
    res.render('add-product') 
})

router.post('/add-product', (req, res, next) => {
    const { bookTitle } = req.body
    console.log('This is the book title', bookTitle)
    products.push({title: bookTitle})
    res.redirect('/')
})

module.exports = {
    router, products
}
