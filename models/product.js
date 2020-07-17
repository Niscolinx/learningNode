const { getDB } = require('../util/database')
const Mongodb = require('mongodb')

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title,
      this.price = price,
      this.description = description,
      this.imageUrl = imageUrl
    this._id = id
  }

  save() {
    const db = getDB()
    let prod;
    console.log('the save', this)

    if (this._id) {
      prod = db.collection('products').updateOne({ _id: this._id }, { $set: this })
      console.log('update')
        
    }
    else{
      prod = db.collection('products').insertOne(this)
      console.log('new save')
    }
    return prod
      .then(result => {
        console.log('the result from db save')
      })
      .catch(err => console.log('err from db save', err))


  }

  static fetchAll() {
    const db = getDB()

    return db.collection('products').find().toArray()
  }

  static findById(prodId) {
    const db = getDB()

    return db.collection('products').find({ _id: new Mongodb.ObjectId(prodId) }).toArray()
  }

  static deleteOne(prodId){
    const db = getDB()

    return db.collection('products').deleteOne({ _id: new Mongodb.ObjectId(prodId) })
  }
}



module.exports = Product