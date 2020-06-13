const express = require('express')

const router = express.Router()

router.get('/add-product', (req, res, next) => {
    console.log('Adding products')
    // res.write('<h3>This is the product page, so please add your product below</h3>')
    res.send('<form action="/admin/add-product" method="POST"><input type="text" placeholder="fill in your book title" name="bookTitle"></input><button>Add Product</button></form>')
})

router.post('/add-product', (req, res, next) => {
    const { bookTitle } = req.body
    console.log('This is the book title', bookTitle)
    res.send('Book title added')
})

module.exports = router;