
const express = require('express');
const { body } = require('express-validator')

const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/isAuth')

const router = express.Router();

//PROTECTED ROUTES
//router.use(isAuth)

router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, isAuth, adminController.getProducts);

router.post('/add-product', [
    body('title')
        .isLength({ min: 3 })
        .isString()
        .trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isLength({ min: 5 })
],
    isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', [
    body('title')
        .isLength({ min: 3 })
        .isString()
        .trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isLength({ min: 5 })
],
    isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

router.get('/clear-cart', isAuth, adminController.clearCart)

module.exports = router;
