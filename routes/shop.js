
const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middlewares/isAuth')
//const authController = require('../controllers/auth');

const router = express.Router();

router.get('/', shopController.getIndex);

//router.get('/signup', authController.getSignup);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

//PROTECTED ROUTES
router.use(isAuth)

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.post('/create-order', shopController.postOrder)

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

module.exports = router;
