const Cart = require('../models/cart')

exports.getAddProducts = (req, res, next) => {

    res.render('admin/add-product', { pageTitle: 'Add product', path: '/admin/add-product' })
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

exports.postAddProducts = (req, res, next) => {
    const { bookTitle } = req.body
    const id = Math.floor(Math.random() * 2000) + bookTitle
    const product = new Products(bookTitle, id)
    product.save()
    res.redirect('/list-products')
}