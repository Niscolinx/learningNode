const express = require('express')
const router = express.Router()

const shopController = require('../controllers/shop')


router.get('/list-products', shopController.listProducts)

router.get('/', shopController.home)

router.get('/cart', shopController.getCart)

router.post('/cart', shopController.postCart)

module.exports = router;
 