const path = require('path')

const express = require('express')
const router = express.Router()

router.get('/add-product', (req, res, next) => {
    console.log('Adding products')
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html')) 
})

router.post('/add-product', (req, res, next) => {
    const { bookTitle } = req.body
    console.log('This is the book title', bookTitle)
    res.send('Book title added')
})

module.exports = router;