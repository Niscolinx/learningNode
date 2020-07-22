const Product = require('../models/product');
const User = require('../models/user')
const Mongodb = require('mongodb')

exports.getAddProduct = (req, res, next) => {

  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  const product = new Product(title, price, description, imageUrl, null, req.user._id)
  product.save()
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log('error from mongodb', err))
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
          product
        });
      }

    })
    .catch(err => {
      console.log('from the edit product', err)
      return res.redirect('/');
    })
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, productId } = req.body;

  const product = new Product(title, price, description, imageUrl, new Mongodb.ObjectId(productId))
  return product.save()
    .then(result => {
      console.log('result from the edited product')
      res.redirect('/admin/products');

    })
    .catch(err => console.log('error from edited product', err))
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(req.user._id)
    .then(prods => {
      User.findById(req.user._id)
        .then(user => {
          console.log('user in found products', user)
          res.render('admin/products', {
            prods,
            user,
            pageTitle: 'Admin Products',
            path: '/admin/products'
          });
        })
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
  Product.deleteOne(prodId)
    .then(product => {
      console.log('successfully deleted product')

      return User.removeCart(prodId, req.user._id)
    })
    .then(cart => {

      res.redirect('/admin/products');
    })
    .catch(err => console.log('error from deleting a product', err))
};

exports.clearCart = (req, res, next) => {

  User.clearCart(req.user._id)
  .then(cart => {
    res.redirect('/cart')
  })
  .catch(err => console.log(err))
}