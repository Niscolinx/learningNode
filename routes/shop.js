const path = require('path')

const express = require('express')
const router = express.Router()

const productsController = require('../controllers/products')


router.get('/list-products', productsController.listProducts)

router.get('/', productsController.home)

router.get('/cart', productsController.getCart)

router.post('/cart', productsController.postCart)

module.exports = router;
 