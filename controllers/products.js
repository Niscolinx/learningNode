const Products = require('../models/products')


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
        console.log('the list products page')
        
        res.render('shop/list-products', { products, pageTitle: 'My shop', path: '/list-products'})
    })
}

