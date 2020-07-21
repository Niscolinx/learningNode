const MongoDb = require('mongodb')
const { getDB } = require('../util/database')

class User {
    constructor(username, email) {
        this.username = username,
            this.email = email,
            this.cart = { items: [] }
    }

    save() {
        const db = getDB()

        return db.collection('users').findOne({ username: this.username })
            .then(userExists => {
                let userData;

                if (userExists === null) {
                    return db.collection('users').insertOne(this)
                        .then(userCreated => {
                            userData = userCreated.ops
                        })
                        .catch(err => { console.log('failed to create user', err) })
                }
                else {
                    userData = userExists
                }
                return userData
            })
            .catch(userNotFound => {
                console.log('user does not exist', userNotFound)
            })
    }

    static findById(userId) {
        const db = getDB()

        return db.collection('users').findOne({ _id: new MongoDb.ObjectId(userId) })
            .then(res => {
                return res
            })
            .catch(err => {
                console.log('Error adding the product', err)
            })
    }

    static addCart(prodId, price, userId) {
        const db = getDB()

        prodId = new MongoDb.ObjectID(prodId)
        return db.collection('users').findOne({ _id: new MongoDb.ObjectID(userId) })
            .then(user => {
                let prevCart = user.cart.items
                const cartItemExists = user.cart.items.filter(p => {
                    return p.productId.toString() === prodId.toString()
                })
                if (cartItemExists.length < 1) {
                    prevCart = [...prevCart, {

                        productId: prodId,
                        quantity: 1,
                        price: +price
                    }]
                }
                else {
                    let oldQuantity = cartItemExists[0].quantity
                    let oldPrice = cartItemExists[0].price

                    cartItemExists[0].quantity = oldQuantity + 1
                    cartItemExists[0].price = oldPrice + +price

                }

                return db.collection('users').updateOne({ _id: new MongoDb.ObjectId(userId) }, {
                    $set: {
                        cart: {
                            items: [...prevCart]
                        }
                    }
                })

            })

    }

    static removeCart(prodId, userId) {
        const db = getDB()

        return db.collection('users').findOne({ _id: new MongoDb.ObjectID(userId) })
            .then(user => {
                let oldCart = user.cart.items

                const newCart = oldCart.filter(cart => {

                    return cart.productId.toString() !== prodId.toString()
                })
                return db.collection('users').updateOne({ _id: new MongoDb.ObjectID(userId) }, {
                    $set: {
                        cart: {
                            items: [...newCart]
                        }
                    }
                })
            })

    }

    static getCart(userId) {
        const db = getDB()
        console.log('the user cart', this.User)
        return db.collection('users').findOne({ _id: new MongoDb.ObjectID(userId) })
            .then(user => {
                return user.cart.items
            })
            .catch(err => console.log('failed to get cart', err))
    }

    static clearCart(userId) {
        const db = getDB()

        return db.collection('users').updateOne({ _id: new MongoDb.ObjectID(userId) }, {
            $set: {
                cart: {
                    items: []
                }
            }
        })
            .then(cart => {
            })
            .catch(err => {
                console.log(err)
            })
    }
}

module.exports = User