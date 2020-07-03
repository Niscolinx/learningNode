
const fs = require('fs')
const path = require('path')

const tp = path.join(path.dirname(process.mainModule.filename), 'data', 'totalprice.json')
const cp = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json')

const Products = require('../models/products')
const Cart = require('../models/cart')
//const totalPrice = require('../models/getTotalPrice')

exports.home = (req, res, next) => {

    res.render('shop/index', { pageTitle: 'Home', path: '/' })
}

exports.getCart = (req, res, next) => {
    fs.readFile(cp, (err, fileContents) => {
        if (err) {
            // res.send('Hello world')
            console.log('the error', err)
        }
        else {
            cartItems = JSON.parse(fileContents)
              let total = 0
            for(let item of cartItems){
                total += Math.floor(Number(item.price))
            }
            cartItem.push({totalPrice: total})
            console.log('the cartItems', cartItem)
        }
    })

    Cart.fetchAll(cart => {
        res.render('shop/cart', { cart, pageTitle: 'My Cart', path: '/cart' })
    })
}


exports.postCart = (req, res, next) => {
    const { cartTitle, price, cartId} = req.body
    const cart = new Cart(cartTitle, price, cartId)
    cart.save()
    res.redirect('/list-products')
}

exports.listProducts = (req, res, next) => {    
    Products.fetchAll(products => {        
        res.render('shop/list-products', { products, pageTitle: 'My shop', path: '/list-products'})
    })
}

