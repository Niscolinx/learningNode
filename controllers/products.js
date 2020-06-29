const Products = require('../models/products')
const Cart = require('../models/cart')


exports.getAddProducts = (req, res, next) => {

    res.render('admin/add-product', { pageTitle: 'Add product', path: '/admin/add-product' })
}

exports.home = (req, res, next) => {

    res.render('shop/index', { pageTitle: 'Home', path: '/' })
}

exports.postAddProducts = (req, res, next) => {
    const { bookTitle } = req.body
    const id = Math.floor(Math.random() * 2000) + bookTitle
    const product = new Products(bookTitle, id)
    product.save()
    res.redirect('/list-products')
}

exports.listProducts = (req, res, next) => {
    Products.fetchAll(products => {
        res.render('shop/list-products', { products, pageTitle: 'My shop', path: '/list-products'})
    })
}

exports.getCart = (req, res, next) => {
    console.log('this is the get cart')
    Cart.fetchAll(cart => {
        res.render('shop/cart', {cart, pageTitle: 'My Cart', path: '/cart'}) 
    })
}

exports.postCart = (req, res, next) => {
    const { cartId } = req.body
    const {cartTitle} = req.body
    console.log('the cart body', cartId)
    const cart = new Cart(cartTitle, cartId)
    cart.save()
    res.redirect('/list-products')
}

exports.postRemoveProduct = (req, res, next) => {
    const { cartId } = req.body
    const cart = new Cart()
    cart.remove(cartId)
    res.redirect('/cart')
}