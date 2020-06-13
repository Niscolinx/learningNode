const express = require('express')

const route = express.Router()

route.use('/add-product', (req, res, next) => {
    console.log('Adding products')
    // res.write('<h3>This is the product page, so please add your product below</h3>')
    res.send('<form action="/product" method="POST"><input type="text" placeholder="fill in your book title" name="bookTitle"></input><button>Add Product</button></form>')
})

route.post('/product', (req, res, next) => {
    const { bookTitle } = req.body
    console.log('This is the book title', bookTitle)
    res.send('Book title added')
})

module.exports = route;