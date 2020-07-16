const Product = require('../models/product');
//const OrderItems = require('../models/orderItems');

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
        product: product[0],
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
  req.user.getCart()
    .then(cart => {
      return cart.getProducts()

    })
    .then(foundCart => {
      console.log('the found cart', foundCart)
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: foundCart
      });
    })
    .catch(err => console.log('the error from cart', err))
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(Products => {
      let product;
      if (Products.length > 0) {
        product = Products[0]
      }
      if (product) {
        let oldQuantity = Number(product.cartItems.quantity)
        newQuantity = oldQuantity + 1
        return product
      }
      else {
        return Product.findByPk(prodId)
      }

    })
    .then(product => {
      fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
      res.redirect('/cart');
    })
    .catch(err => console.log('err from post cart', err))
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      const product = products[0]
      product.cartItems.destroy()
    })
    .then(result => {
      console.log('destroyed the a cart item', result)
      res.redirect('/cart');
    })
    .catch(err => console.log('err destroying the cart item', err))
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          return order.addProducts(products.map(p => {
            p.orderItems = { quantity: p.cartItems.quantity }
            return p
          }))
        })
        .catch(err => console.log('err posting order', err))
    })
    .then(order => {
      return fetchedCart.setProducts(null)
    })
    .then(result => {
      res.redirect('/orders')
    })
    .catch(err => console.log('err posting order', err))
}


exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
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
