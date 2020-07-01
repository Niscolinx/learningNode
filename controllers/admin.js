const Cart = require('../models/cart')
const Products = require('../models/products')

exports.getAddProducts = (req, res, next) => {

    res.render('admin/add-product', { pageTitle: 'Add product', path: '/admin/add-product' })
}


exports.postRemoveProduct = (req, res, next) => {
    console.log('this is the remove cart')
    const { cartId } = req.body
    const cart = new Cart()
    cart.remove(cartId)
    res.redirect('/cart')
}

exports.postAddProducts = (req, res, next) => {
    const { bookTitle, description, price, imgUrl } = req.body
    const id = Math.floor(Math.random() * 2000) + bookTitle
    const product = new Products(bookTitle, description, price, imgUrl, id)
    product.save()
    res.redirect('/list-products')
}