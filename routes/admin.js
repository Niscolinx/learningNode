const path = require('path')

const express = require('express')
const router = express.Router()

const adminController = require('../controllers/admin')
const shopController = require('../controllers/shop')

router.get('/add-product', adminController.getAddProducts)

router.post('/add-product', adminController.postAddProducts)

router.post('/remove-product', shopController.postRemoveProduct)

module.exports = router
