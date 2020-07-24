const Product = require('../models/product');
const Order = require('../models/order')

exports.getProducts = (req, res, next) => {
  Product.find()
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
  Product.find()
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

  req.user.populate('cart.items.productId').execPopulate()
    .then(user => {

      const products = user.cart.items
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products
      });
    })
    .catch(err => console.log(err))
};

exports.postCart = (req, res, next) => {
  const { productId, price } = req.body;

  req.user.addToCart(productId, price)
    .then(product => {
      console.log('Added the cart', product)
      res.redirect('/products')
    })
    .catch(err => console.log('err from post cart', err))
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user.removeCart(prodId)
    .then(cart => {
      console.log('deleted cart')
      res.redirect('/cart')
    })
    .catch(err => console.log('err deleting the cart item', err))
};

exports.postOrder = (req, res, next) => {
  req.user.populate('cart.items.productId').execPopulate()
    .then(user => {
      return user.cart.items
    })
    .then(cart => {
      const products = cart.map(i => {
        return {price: i.price, quantity: i.quantity, cartProduct: i.productId._doc}
      })

      const order = new Order({
        orders: products,
        user: {
          name: req.user.name,
          userId: req.user
        }
      })
      return order.save()
    })
    .then(result => {
      res.redirect('/orders')
    })
    .catch(err => console.log('err posting order', err))
}


exports.getOrders = (req, res, next) => {
  let totalPrice = 0
  Order.find()
    .then(result => {
      console.log('the list orders', result)
      for (let item of result[0].orders) {
        totalPrice += item.price
      }
      return result
    })
    .then(orders => {
     let innerItems = orders[0].orders
      console.log('the orders', orders)
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
        innerItems,
        totalPrice
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
