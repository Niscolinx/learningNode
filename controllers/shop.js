const Product = require('../models/product');
const User = require('../models/user')

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log('the error from findAll products', err)
    })

};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log('error from getting a product detail', err))
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      console.log('the products data', products)

      res.render('shop/index', {
        prods: products,
        pageTitle: 'All Products',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err)
    })
};

exports.getCart = (req, res, next) => {
  let handleCart = [];
  User.getCart(req.user._id)
    .then(cart => {

      return Product.fetchAll()
        .then(products => {
          let filterProds
          return cart.forEach(c => {
            filterProds = products.filter(p => {
              return c.productId.toString() === p._id.toString()
            })
            handleCart.push({ ...filterProds[0], quantity: c.quantity, price: c.price })
          })

        })
        .catch(err => console.log(err))

    })
    .then(foundCart => {
      foundCart = handleCart
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: foundCart
      });
    })
    .catch(err => console.log('the error from cart', err))
};

exports.postCart = (req, res, next) => {
  const {productId, price} = req.body;

  Product.findById(productId)
    .then(product => {
      return User.addCart(productId, price, req.user._id)
        .then(result => {
          console.log('Added the cart')
          res.redirect('/products')
        })
    })
    .catch(err => console.log('err from post cart', err))
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  User.removeCart(prodId, req.user._id)
    .then(cart => {
      console.log('deleted cart')
      res.redirect('/cart')
    })
    .catch(err => console.log('err deleting the cart item', err))
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  User.getCart(req.user._id)
    .then(cart => {
      fetchedCart = cart
      return User.postOrder(cart, req.user._id)
    })
    
    .then(order => {
      return User.clearCart(req.user._id)
    })
    .then(result => {
      res.redirect('/orders')
    })
    .catch(err => console.log('err posting order', err))
}


exports.getOrders = (req, res, next) => {
  User.getOrders(req.user._id)
    .then(result => {
      console.info('the order result', result)
      return result
    })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders
      });

    })
    .catch(err => console.log('err getting orders', err))
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
