const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')

const Product = require('../models/product')
const Order = require('../models/order')

const PAGE_TOTAL_COUNT = 2

exports.getProducts = (req, res, next) => {
    let page = req.query.page
    let totalCount

    page = Number(page)
    if (!page) {
        page = 1
    }
    Product.find()
        .countDocuments()
        .then((totalNumberOfProducts) => {
            totalCount = totalNumberOfProducts
            return Product.find()
                .skip((page - 1) * PAGE_TOTAL_COUNT)
                .limit(PAGE_TOTAL_COUNT)
        })
        .then((products) => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
                currentPage: page,
                hasNext: PAGE_TOTAL_COUNT * page < totalCount,
                hasPrev: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
                lastPage: Math.ceil(totalCount / PAGE_TOTAL_COUNT),
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
    let page = req.query.page
    let totalCount

    page = Number(page)
    if(!page){
        page = 1
    }
    Product.find()
        .countDocuments()
        .then((totalNumberOfProducts) => {
            totalCount = totalNumberOfProducts
            return Product.find()
                .skip((page - 1) * PAGE_TOTAL_COUNT)
                .limit(PAGE_TOTAL_COUNT)
        })
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'All Products',
                path: '/',
                currentPage: page,
                hasNext: PAGE_TOTAL_COUNT * page < totalCount,
                hasPrev: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
                lastPage: Math.ceil(totalCount / PAGE_TOTAL_COUNT)
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
   req.user
       .populate('cart.items.productId')
       .execPopulate()
       .then((user) => {
           let totalCartPrice = 0

           const products = user.cart.items

           for (let item of products) {
               totalCartPrice += item.price
           }
           res.render('shop/checkout', {
               path: '/checkout',
               pageTitle: 'Checkout',
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

            const pdfDoc = new PDFDocument()
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader(
                'Content-Disposition',
                'inline; filename="' + invoiceName + '"'
            )

            pdfDoc.pipe(fs.createWriteStream(invoicePath))
            pdfDoc.pipe(res)

            pdfDoc.moveUp()
            pdfDoc.fontSize(25).text('Invoice', {
                underline: true,
                align: 'center',
                columns: true,
            })

            pdfDoc.text('-----------------------------------------', {
                align: 'center',
            })

            let totalPrice = 0
            order.orders.forEach((orderItem) => {
                totalPrice += orderItem.price
                pdfDoc.moveDown()
                pdfDoc
                    .fontSize(18)
                    .text(
                        `${orderItem.cartProduct.title}  - ${orderItem.quantity}  x $${orderItem.cartProduct.price} = $${orderItem.price}`,
                        {
                            align: 'center',
                        }
                    )
            })

            pdfDoc.text('-----------------------------------------', {
                align: 'center',
            })
            pdfDoc.fontSize(23).text(`Total price: $${totalPrice}`, {
                align: 'center',
            })

            pdfDoc.end()
        })
        .catch((err) => next(err))
}
