
const express = require('express')
const router = express.Router()

const adminController = require('../controllers/admin')

router.get('/add-product', adminController.getAddProducts)

router.post('/add-product', adminController.postAddProducts)

router.post('/remove-product', adminController.postRemoveProduct)

//router.post('/edit-product', adminController.postEditProduct)

router.get('/edit-product', adminController.getEditProduct)

module.exports = router
