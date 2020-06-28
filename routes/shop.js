const path = require('path')

const express = require('express')
const router = express.Router()

const productsController = require('../controllers/products')


router.get('/', productsController.listProducts)

router.get('/cart', productsController.cart)

module.exports = router;
 