const Products = require('../models/products')


exports.getAddProducts = (req, res, next) => {

    res.render('admin/add-product', { pageTitle: 'Add product', path: '/admin/add-product' })
}

exports.postAddProducts = (req, res, next) => {
    const { bookTitle } = req.body
    const id = Math.floor(Math.random() * 2000) + bookTitle
    const product = new Products(bookTitle, id)
    product.save()
    res.redirect('/')
}

exports.listProducts = (req, res, next) => {
    Products.fetchAll(products => {
        res.render('shop/list-products', { products, pageTitle: 'My shop', path: '/'})
    })
}

exports.cart = (req, res, next) => {
    Products.displayCart(cart => {
        res.render('shop/cart', {cart, pageTitle: 'My Cart', path: '/cart'})
    })
}