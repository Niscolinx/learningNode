
const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/isAuth')

const router = express.Router();

//PROTECTED ROUTES
//router.use(isAuth)

router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, isAuth, adminController.getProducts);

router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

router.get('/clear-cart', isAuth, adminController.clearCart)

module.exports = router;
