const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const {title, imageUrl, price, description} = req.body;
 
  Product.create({
    title,
    imageUrl,
    price,
    description
  })
  .then(result => {
    console.log('result from sequelize', result)
    res.redirect('/admin/products')
  })
  .catch(err => console.log('error from sequelize', err))
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
  .then(product => {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });

  })
  .catch(err => {
    console.log('from the edit product', err)
    return res.redirect('/');
  })
};

exports.postEditProduct = (req, res, next) => {
  const {productId, title, price, imageUrl, description} = req.body;

  Product.findByPk(productId).then(product => {
    product.title = title,
    product.price = price,
    product.imageUrl = imageUrl,
    product.description = description
    return product.save()
  })
  .then(result => {
    console.log('result from the edited product', result)
    res.redirect('/admin/products');

  })
  .catch(err => console.log('error from edited product', err))
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err => console.log('error from admin findAll', err))
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
  .then(product => {
    return product.destroy()
  })
  .then(success => {
    console.log('successfully deleted product', success)
    res.redirect('/admin/products');
  })
  .catch(err => console.log('error from deleting a product', err))
};
