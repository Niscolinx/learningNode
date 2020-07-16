const { getDB } = require('../util/database')
const Mongodb = require('mongodb')

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title,
    this.price = price,
    this.description = description,
    this.imageUrl = imageUrl
  }

  save() {
    const db = getDB()
    
    return db.collection('products').insertOne(this)
      .then(result => {
        console.log('the result from db', result)
      })
      .catch(err => console.log('err from db', err))
  }

  static fetchAll(){
    const db = getDB()

    return db.collection('products').find().toArray()
  }

  static findById(prodId) {
    const db = getDB()

    return db.collection('products').find({_id: new Mongodb.ObjectID(prodId)}).toArray()
  } 
}



module.exports = Product