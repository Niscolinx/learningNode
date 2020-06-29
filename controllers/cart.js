const Cart = require('../models/cart')

exports.getCart = (req, res, next) => {
    console.log('this is the get cart')
    Cart.fetchAll(cart => {
        res.render('shop/cart', { cart, pageTitle: 'My Cart', path: '/cart' })
    })
}

exports.postCart = (req, res, next) => {
    const { cartId } = req.body
    const { cartTitle } = req.body

    console.log('the cart body', req.body)
    const cart = new Cart(cartTitle, cartId)
    cart.save()
    res.redirect('/list-products')
}

exports.postRemoveProduct = (req, res, next) => {
    console.log('this is the remove cart')
    const { cartId } = req.body
    const cart = new Cart()
    cart.remove(cartId)
    res.redirect('/cart')
}