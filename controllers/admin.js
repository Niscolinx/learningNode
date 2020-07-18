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
  console.log('the user id', req.user)
  const user = User.findById(req.user)
  user.then(result => console.log('result', result)).catch(err => console.log('error', err))

  const product = new Product(title, price, description, imageUrl, null, req.user._id)
  product.save()
    .then(result => {
      console.log('result from added mongodb', result)
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
  Product.fetchAll()
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
    .then(success => {
      console.log('successfully deleted product')
      res.redirect('/admin/products');
    })
    .catch(err => console.log('error from deleting a product', err))
};
