const MongoDb = require('mongodb')
const { getDB } = require('../util/database')
const Product = require('./product')

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
                            console.log('user created', userCreated.ops)
                            userData = userCreated.ops
                        })
                        .catch(err => { console.log('failed to create user', err) })
                }
                else {
                    console.log('user found', userExists)
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

    static addCart(prodId, userId) {
        const db = getDB()
        
        return db.collection('users').findOne({ _id: new MongoDb.ObjectID(userId) })
            .then(user => {
                let prevCart = user.cart.items
                let toUpdate;
                const cartItemExists = user.cart.items.filter(p => {
                    return p.productId === prodId
                })

                if (cartItemExists.length < 1) {
                    console.log('the cart Id not found', cartItemExists)
                    toUpdate = {
                        productId: prodId,
                        quantity: 1
                    }
                }
                else {
                    console.log('the cart Id is found', cartItemExists)

                    let increment = cartItemExists[0].quantity
                    cartItemExists[0].quantity = increment + 1
                    toUpdate = null
                }

                return db.collection('users').updateOne({ _id: new MongoDb.ObjectId(userId) }, {
                    $set: {
                        cart: {
                            items: [...prevCart, toUpdate]
                        }
                    }
                })

            })

    }

    static getCart() {
        const db = getDB()

        return db.collection('users').find().toArray()
            .then(cart => {
                console.log('All cart', cart)
                return cart
            })
            .catch(err => console.log('failed to get cart', err))
    }
}

module.exports = User