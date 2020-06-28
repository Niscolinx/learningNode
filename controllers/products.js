const Products = require('../models/products')


exports.getAddProducts = (req, res, next) => {

    res.render('admin/add-product', { pageTitle: 'Add product' })
}

exports.postAddProducts = (req, res, next) => {
    const { bookTitle } = req.body
    const product = new Products(bookTitle)
    product.save()
    res.redirect('/')
}

exports.getShop = (req, res, next) => {
    Products.fetchAll(products => {
        res.render('shop/list-products', { products, pageTitle: 'My shop' })
    })
}