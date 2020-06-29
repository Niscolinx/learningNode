const path = require('path')

const express = require('express')
const router = express.Router()

const productsController = require('../controllers/products')
const cartController = require('../controllers/cart')


router.get('/list-products', productsController.listProducts)

router.get('/', productsController.home)

router.get('/cart', cartController.getCart)

router.post('/cart', cartController.postCart)

module.exports = router;
 