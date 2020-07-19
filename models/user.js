const MongoDb = require('mongodb')
const {getDB} = require('../util/database')

class User {
    constructor(username, email){
        this.username = username,
        this.email = email,
        this.cart = {items: []}
    }

    save(){
        const db = getDB()
        
        return db.collection('users').findOne({username: this.username})
        .then(userExists => {
            let userData;

            if(userExists === null){
                return db.collection('users').insertOne(this)
                .then(userCreated => {
                    console.log('user created', userCreated.ops)
                    userData = userCreated.ops
                })
                .catch(err => {console.log('failed to create user', err)})
            }
            else{
                console.log('user found', userExists)
                userData = userExists
            }
            return userData
        })
        .catch(userNotFound => {
            console.log('user does not exist', userNotFound)
        })  
    }

    static findById(userId){
        const db = getDB()

        return db.collection('users').findOne({_id: new MongoDb.ObjectId(userId)})
        .then(res => {
            return res
        })
        .catch(err => {
            console.log('Error adding the product', err)
        })
    }

    static addCart(prodId, userId){
        const db = getDB()
        let updatedCart;

        console.log(prodId, userId)

      return  db.collection('users').findOne({_id: new MongoDb.ObjectId(userId)})
        .then(user => {
            console.log('the user', user)
            updatedCart = user.cart
            return db.collection('products').findOne({ _id: new MongoDb.ObjectId(prodId) })
        })
        .then(product => {
            console.log('the product', product)
            updatedCart = {...updatedCart, items: product, quantity: 1}
            this.cart = updatedCart
            console.log('the full user', this)
            return db.collection('users').updateOne({ _id: new MongoDb.ObjectId(userId) }, {$set: this})
        })
        .catch(err => {
            console.log('Failed to post cart', err)
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