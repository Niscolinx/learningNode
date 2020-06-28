const path = require('path')

const express = require('express')
const router = express.Router()

const productsController = require('../controllers/products')


router.get('/list-products', productsController.listProducts)

router.get('/', productsController.home)

router.post('/cart', productsController.cart)

module.exports = router;
 