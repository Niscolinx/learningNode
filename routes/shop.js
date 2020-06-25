const path = require('path')

const express = require('express')
const router = express.Router()

const rootDir = require('../path')
const productsData = require('./admin')


router.get('/', (req, res, next) => {
    const data = productsData.bookTitle
    res.render('shop', {products: data, docTitle: 'My shop'})
   // res.sendFile(path.join(rootDir, 'views', 'shop.pug'))
})

module.exports = router;
