const Cart = require('../models/cart')
const Products = require('../models/products')

exports.getAddProducts = (req, res, next) => {

    res.render('admin/add-product', { pageTitle: 'Add product', path: '/admin/add-product' })
}

exports.getEditProduct = (req, res, next) => {

    res.render('admin/edit-product', { pageTitle: 'Edit product', path: '/admin/edit-product' })
}

exports.getEditProduct = (req, res, next) => {
    Products.fetchAll(products => {
        let id;
        let product_details;
        for (let items in req.query) {
            if (items === 'cartId') {
                id = req.query[items]
                break;
            }
        }

        for (let product of products) {
            if (product.id === id) {
                product_details = product
                break;
            }
        }

        res.render('admin/edit-product', { product_details, pageTitle: 'Edit page', path: '/admin/edit-product' })
    })
}


exports.postEditProduct = (req, res, next) => {
    console.log('this is the edit page', req.body)
    const {bookTitle, price, imgUrl, description, id } = req.body
    const updateProduct = new Products(bookTitle, description, price, imgUrl, id)
    updateProduct.update(id)
    res.redirect('/list-products')
}

exports.postRemoveProduct = (req, res, next) => {
    console.log('this is the remove cart', req.body)
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
exports.postRemoveProducts = (req, res, next) => {
    const { bookTitle, description, price, imgUrl } = req.body
    const id = Math.floor(Math.random() * 2000) + bookTitle
    const product = new Products(bookTitle, description, price, imgUrl, id)
    product.remove()
    res.redirect('/list-products')
}

