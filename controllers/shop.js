const fs = require('fs')
const path = require('path')

const Product = require('../models/product')
const Order = require('../models/order')

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
            })
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatus = 500
            return next(error)
        })
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId

    Product.findById(prodId)
        .then((product) => {
            res.render('shop/product-detail', {
                product,
                pageTitle: product.title,
                path: '/products',
            })
        })
        .catch((err) => {
            console.log('error from getting a product detail', err)
            res.redirect('/products')
        })
}

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'All Products',
                path: '/',
            })
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatus = 500
            return next(error)
        })
}

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            let totalCartPrice = 0

            const products = user.cart.items

            for (let item of products) {
                totalCartPrice += item.price
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products,
                totalCartPrice,
            })
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatus = 500
            return next(error)
        })
}

exports.postCart = (req, res, next) => {
    const { productId, price } = req.body

    req.user
        .addToCart(productId, price)
        .then((product) => {
            res.redirect('/products')
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatus = 500
            return next(error)
        })
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId

    req.user
        .removeCart(prodId)
        .then((cart) => {
            console.log('deleted cart')
            res.redirect('/cart')
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatus = 500
            return next(error)
        })
}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            return user.cart.items
        })
        .then((cart) => {
            const products = cart.map((i) => {
                return {
                    price: i.price,
                    quantity: i.quantity,
                    cartProduct: i.productId._doc,
                }
            })

            const order = new Order({
                orders: products,
                user: {
                    email: req.user.email,
                    userId: req.user,
                },
            })
            return order.save()
        })
        .then((result) => {
            req.user
                .clearCart()
                .then((cart) => {
                    res.redirect('/orders')
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatus = 500
            return next(error)
        })
}

exports.getOrders = (req, res, next) => {
    let totalPrice = 0
    Order.find({ 'user.userId': req.user._id })
        .then((result) => {
            let innerItems = []
            for (let i of result) {
                innerItems.push(i.orders)
            }
            let reducedItems = innerItems.reduce((acc, arr) => {
                return acc.concat(arr)
            }, [])

            for (let item of reducedItems) {
                totalPrice += item.price
            }

            return result
        })
        .then((orders) => {
            let newOrders = []
            for (let i of orders) {
                newOrders.push({ products: i.orders })
            }
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders,
                totalPrice: totalPrice.toFixed(2),
            })
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatus = 500
            return next(error)
        })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
    })
}

exports.getOrderInvoice = (req, res, next) => {
    const orderId = req.params.orderId
    const invoiceName = 'invoice-' + orderId + '.pdf'
    const invoicePath = path.join('data', 'invoices', invoiceName)

    Order.findById(orderId)
        .then((order) => {
            if (!order) return next(new Error('No order was found'))

            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('UnAuthorised'))
            }
            // fs.readFile(invoicePath, (err, data) => {
            //     if (err) return next(err)

            //     res.setHeader('Content-Type', 'application/pdf')
            //     res.setHeader(
            //         'Content-Disposition',
            //         'inline; filename="' + invoiceName + '"'
            //     )
            //     res.send(data)
            // })

            const file = fs.createReadStream(invoicePath)

            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader(
                'Content-Disposition',
                'inline; filename="' + invoiceName + '"'
            )
            file.pipe(res)
        })
        .catch((err) => next(err))
}
