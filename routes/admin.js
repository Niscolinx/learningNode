const path = require('path')

const express = require('express')
const router = express.Router()

const rootDir = require('../path')


router.get('/add-product', (req, res, next) => {
    console.log('Adding products')
    res.render(path.join(rootDir, 'views', 'add-product.pug')) 
})

router.post('/add-product', (req, res, next) => {
    const { bookTitle } = req.body
    console.log('This is the book title', bookTitle)
    res.send('Book title added')
})

module.exports = router;