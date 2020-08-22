const Product = require('../models/product')
const { validationResult } = require('express-validator')
const fileDelete = require('../util/fileDelete')


const PAGE_TOTAL_COUNT = 2

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        errorMessage: null,
        editing: null,
        hasError: null,
        validationError: []
    })
}

exports.postAddProduct = (req, res, next) => {
    const { title, price, description } = req.body
    const image = req.file

    const errors = validationResult(req)
    if (!errors.isEmpty() || !image) {
        return res.status(422).render('admin/edit-product', {
            path: '/admin/add-product',
            pageTitle: 'Add product',
            errorMessage: !image
                ? 'Attached file is not an image'
                : errors.array()[0].msg,
            product: {
                title,
                price,
                description,
            },
            editing: false,
            hasError: true,
            validationError: errors.array(),
        })
    }

    const image_path = image.path
    const product = new Product({
        title,
        price,
        description,
        image_path,
        userId: req.user,
    })

    product
        .save()
        .then((result) => {
            res.redirect('/admin/products')
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatus = 500
            return next(error)
        })
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit

    if (!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId
    Product.findById(prodId)
        .then((product) => {
            if (!product) {
                res.redirect('admin/products')
            } else {
                res.render('admin/edit-product', {
                    pageTitle: 'Edit Product',
                    path: '/admin/edit-product',
                    editing: editMode,
                    errorMessage: null,
                    editing: true,
                    hasError: null,
                    validationError: [],
                    product,
                })
            }
        })
        .catch((err) => {
            return res.redirect('/')
        })
}

exports.postEditProduct = (req, res, next) => {
    const { title, price, description, productId } = req.body
    const image = req.file

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            path: '/admin/edit-product',
            pageTitle: 'Edit product',
            errorMessage: !image
                ? 'Attached file is not an image'
                : errors.array()[0].msg,
            product: {
                title,
                price,
                description,
            },
            editing: true,
            hasError: true,
            validationError: errors.array(),
        })
    }

    Product.findById(productId)
        .then((product) => {
            const productId = product.userId.toString()
            const userId = req.user._id.toString()

            const oldImage = product.image_path

            if (productId !== userId) {
                throw new Error('User is not Authorised')
            }
            product.title = title
            if (image) {
                product.image_path = image.path
                fileDelete.deleteFile(oldImage)
            }
            product.price = price
            product.description = description

            product.save().then((result) => {
                return res.redirect('/admin/products')
            })
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatus = 500
            return next(error)
        })
}

exports.getProducts = (req, res, next) => {
    let page = req.query.page
    let totalCount

    page = Number(page)
    if (!page) {
        page = 1
    }
    Product.find({ userId: req.user._id })
        .countDocuments()
        .then((totalNumberOfProducts) => {
            totalCount = totalNumberOfProducts
            return Product.find()
                .skip((page - 1) * PAGE_TOTAL_COUNT)
                .limit(PAGE_TOTAL_COUNT)
        })
        .then((products) => {
            res.render('admin/products', {
                prods: products,
                user: req.user.email,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                currentPage: page,
                hasNext: PAGE_TOTAL_COUNT * page < totalCount,
                hasPrev: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
                lastPage: Math.ceil(totalCount / PAGE_TOTAL_COUNT),
            })
        })
        .catch((err) => {
            console.log('failed to get products', err)
            let prods = []
            let user = null
            res.render('admin/products', {
                prods,
                user,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            })
        })
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId

    Product.findById(prodId)
        .then((product) => {
            if (!product) return next(new Error('Product not found'))

            fileDelete.deleteFile(product.image_path)
            return Product.deleteOne({ _id: prodId, userId: req.user._id })
        })
        .then((product) => {
            res.redirect('/admin/products')
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatus = 500
            return next(error)
        })
}

exports.clearCart = (req, res, next) => {
    req.user
        .clearCart()
        .then((cart) => {
            res.redirect('/cart')
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatus = 500
            return next(error)
        })
}
