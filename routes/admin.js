const path = require('path')

const express = require('express')
const router = express.Router()

const productControllers = require('../controllers/products')



router.get('/add-product', productControllers.getAddProducts)

router.post('/add-product', productControllers.postAddProducts)

module.exports = router
