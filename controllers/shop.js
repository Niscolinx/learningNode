
const Products = require('../models/products')
const Cart = require('../models/cart')

exports.home = (req, res, next) => {

    res.render('shop/index', { pageTitle: 'Home', path: '/' })
}

exports.getCart = (req, res, next) => {    
    Cart.fetchAll(cart => {
        console.log('the single cart', cart)
        res.render('shop/cart', { cart, pageTitle: 'My Cart', path: '/cart' })
    })
}


exports.postCart = (req, res, next) => {
    const { cartTitle, price, imgUrl, cartId } = req.body
    const cart = new Cart(cartTitle, price, imgUrl,cartId)
    cart.save()
    res.redirect('/list-products')
}

exports.listProducts = (req, res, next) => {
    Products.fetchAll(products => {
        res.render('shop/list-products', { products, pageTitle: 'My shop', path: '/list-products' })
    })
}

