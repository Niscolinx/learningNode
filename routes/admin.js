const path = require('path')

const express = require('express')
const router = express.Router()

const productsController = require('../controllers/products')

router.get('/add-product', productsController.getAddProducts)

router.post('/add-product', productsController.postAddProducts)

router.post('/edit-product', productsController.postRemoveProduct)

module.exports = router
