const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
})

userSchema.methods.getCart = function(){

    return this.cart
}

userSchema.methods.addToCart = function(prodId, price){

    price = +price
    console.log('the add to cart', prodId, typeof(price))

    const productIdx = this.cart.items.findIndex(p => {
       return p.productId.toString() === prodId.toString()
    })

    console.log('the index', productIdx)
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items]

    if(productIdx >= 0){
        newQuantity = this.cart.items[productIdx].quantity
        oldPrice = this.cart.items[productIdx].price
        updatedCartItems[productIdx].quantity = newQuantity + 1
        updatedCartItems[productIdx].price = oldPrice + price
    }
    else{
        updatedCartItems.push({
            productId: prodId,
            quantity: newQuantity,
            price: price
        })
    }
    const updatedCart = {
        items: updatedCartItems
    }

    this.cart = updatedCart

   return this.save()
}

module.exports = mongoose.model('users', userSchema)

// const MongoDb = require('mongodb')
// const { getDB } = require('../util/database')

// class User {
//     constructor(username, email) {
//         this.username = username,
//             this.email = email,
//             this.cart = { items: [] }
//     }

//     save() {
//         const db = getDB()

//         return db.collection('users').findOne({ username: this.username })
//             .then(userExists => {
//                 let userData;

//                 if (userExists === null) {
//                     return db.collection('users').insertOne(this)
//                         .then(userCreated => {
//                             userData = userCreated.ops
//                         })
//                         .catch(err => { console.log('failed to create user', err) })
//                 }
//                 else {
//                     userData = userExists
//                 }
//                 return userData
//             })
//             .catch(userNotFound => {
//                 console.log('user does not exist', userNotFound)
//             })
//     }

//     static findById(userId) {
//         const db = getDB()

//         return db.collection('users').findOne({ _id: new MongoDb.ObjectId(userId) })
//             .then(res => {
//                 return res
//             })
//             .catch(err => {
//                 console.log('Error adding the product', err)
//             })
//     }

//     static addCart(prodId, price, userId) {
//         const db = getDB()

//         prodId = new MongoDb.ObjectID(prodId)
//         return db.collection('users').findOne({ _id: new MongoDb.ObjectID(userId) })
//             .then(user => {
//                 let prevCart = user.cart.items
//                 const cartItemExists = user.cart.items.filter(p => {
//                     return p.productId.toString() === prodId.toString()
//                 })
//                 if (cartItemExists.length < 1) {
//                     prevCart = [...prevCart, {

//                         productId: prodId,
//                         quantity: 1,
//                         price: +price
//                     }]
//                 }
//                 else {
//                     let oldQuantity = cartItemExists[0].quantity
//                     let oldPrice = cartItemExists[0].price

//                     cartItemExists[0].quantity = oldQuantity + 1
//                     cartItemExists[0].price = oldPrice + +price

//                 }

//                 return db.collection('users').updateOne({ _id: new MongoDb.ObjectId(userId) }, {
//                     $set: {
//                         cart: {
//                             items: [...prevCart]
//                         }
//                     }
//                 })

//             })

//     }

//     static removeCart(prodId, userId) {
//         const db = getDB()

//         return db.collection('users').findOne({ _id: new MongoDb.ObjectID(userId) })
//             .then(user => {
//                 let oldCart = user.cart.items

//                 const newCart = oldCart.filter(cart => {

//                     return cart.productId.toString() !== prodId.toString()
//                 })
//                 return db.collection('users').updateOne({ _id: new MongoDb.ObjectID(userId) }, {
//                     $set: {
//                         cart: {
//                             items: [...newCart]
//                         }
//                     }
//                 })
//             })

//     }

//     static getCart(userId) {
//         const db = getDB()
//         return db.collection('users').findOne({ _id: new MongoDb.ObjectID(userId) })
//             .then(user => {
//                 return user.cart.items
//             })
//             .catch(err => console.log('failed to get cart', err))
//     }

//     static clearCart(userId) {
//         const db = getDB()

//         return db.collection('users').updateOne({ _id: new MongoDb.ObjectID(userId) }, {
//             $set: {
//                 cart: {
//                     items: []
//                 }
//             }
//         })
//             .then(cart => {
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }

//     static postOrder(cart, userId) {
//         console.log('cart', typeof(cart),  cart)
//         const order = { ...cart, userId }

//         const db = getDB()

//         return db.collection('orders').insertOne(order)
//             .then(order => {
//                 return order
//             })
//             .catch(err => { console.log(err) })
//     }

//     static getOrders(userId) {
//         const db = getDB()
//         let store = []
//         return db.collection('orders').find({ userId: new MongoDb.ObjectID(userId) }).toArray()
//             .then(orders => {
//                 for(let item of orders){
//                    store.push(Object.values(item))
//                 }
//                 let newStore = store.reduce((acc, arr) => { return acc.concat(arr)}, [])
//                 let transformed = []
//                 for(let i of newStore){
//                     if(i.productId){
//                         transformed.push(i)
//                     }
//                 }
//                 return transformed
//             })
//             .catch(err => console.log(err))
//     }
// }

// module.exports = User