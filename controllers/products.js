const products = []


exports.getAddProducts = (req, res, next) => {

    res.render('add-product', { pageTitle: 'Add product' })
}

exports.postAddProducts = (req, res, next) => {
    const { bookTitle } = req.body
    products.push({ title: bookTitle })
    res.redirect('/')
}

exports.getShop = (req, res, next) => {
    res.render('shop', { products, pageTitle: 'My shop' })
}