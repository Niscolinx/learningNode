const Products = require('../models/products')

exports.home = (req, res, next) => {

    res.render('shop/index', { pageTitle: 'Home', path: '/' })
}

exports.getCart = (req, res, next) => {
    console.log('this is the get cart')
    Cart.fetchAll(cart => {
        res.render('shop/cart', { cart, pageTitle: 'My Cart', path: '/cart' })
    })
}

exports.listProducts = (req, res, next) => {    
    Products.fetchAll(products => {
        console.log('the list products page')
        
        res.render('shop/list-products', { products, pageTitle: 'My shop', path: '/list-products'})
    })
}

