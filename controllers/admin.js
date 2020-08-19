const Product = require('../models/product');
const { validationResult } = require('express-validator')

exports.getAddProduct = (req, res, next) => {

  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    errorMessage: null,
    editing: null,
    hasError: null,
    validationError: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, image, price, description } = req.body;

  const errors = validationResult(req)
  console.log('Error from posting a product', errors.array())
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      path: '/admin/add-product',
      pageTitle: 'Add product',
      errorMessage: errors.array()[0].msg,
      product: {
        title,
        image,
        price,
        description
      },
      editing: false,
      hasError: true,
      validationError: errors.array()
    });
  }
  const product = new Product({ title, price, description, image, userId: req.user })
  product.save()
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        res.redirect('admin/products')
      }
      else {
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          errorMessage: null,
          editing: true,
          hasError: null,
          validationError: [],
          product
        });
      }

    })
    .catch(err => {
      return res.redirect('/');
    })
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, productId } = req.body;

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      path: '/admin/edit-product',
      pageTitle: 'Edit product',
      errorMessage: errors.array()[0].msg,
      product: {
        title,
        imageUrl,
        price,
        description
      },
      editing: true,
      hasError: true,
      validationError: errors.array()
    });
  }
  Product.findById(productId)
    .then(product => {
      const productId = product.userId.toString()
      const userId = req.user._id.toString()

      if (productId === userId) {
        product.title = title,
          product.imageUrl = imageUrl,
          product.price = price,
          product.description = description

        product.save().then(result => {
          res.redirect('/admin/products');
        })
      } else {
        return res.status(422).render('admin/edit-product', {
          path: '/admin/edit-product',
          pageTitle: 'Edit product',
          errorMessage: errors.array()[0].msg,
          product: {
            title,
            imageUrl,
            price,
            description
          },
          editing: true,
          hasError: true,
          validationError: errors.array()
        })
      }
    })
    .catch(err => console.log('error from edited product', err))
};

exports.getProducts = (req, res, next) => {

  Product.find({ userId: req.user._id })
    .then(products => {
      res.render('admin/products', {
        prods: products,
        user: req.user.email,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log('failed to get products', err)
      let prods = []
      let user = null
      res.render('admin/products', {
        prods,
        user,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })

};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(product => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log('error from deleting a product', err))
};

exports.clearCart = (req, res, next) => {

  req.user.clearCart()
    .then(cart => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}