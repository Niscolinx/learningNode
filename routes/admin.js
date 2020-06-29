const path = require('path')

const express = require('express')
const router = express.Router()

const productsController = require('../controllers/products')
const cartController = require('../controllers/cart')

router.get('/add-product', productsController.getAddProducts)

router.post('/add-product', productsController.postAddProducts)

router.post('/remove-product', cartController.postRemoveProduct)

module.exports = router
