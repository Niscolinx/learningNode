const Products = require('../models/products')


exports.getAddProducts = (req, res, next) => {

    res.render('add-product', { pageTitle: 'Add product' })
}

exports.postAddProducts = (req, res, next) => {
    const { bookTitle } = req.body
    const product = new Products(bookTitle)
    product.save()
    res.redirect('/')
}

exports.getShop = (req, res, next) => {
    const fetchAllProducts = new Products
    const productItems = fetchAllProducts.fetchAll()
    res.render('shop', { products: productItems, pageTitle: 'My shop' })
}