const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productData = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Product', productData)



// const { getDB } = require('../util/database')
// const Mongodb = require('mongodb')

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title,
//     this.price = price,
//     this.description = description,
//     this.imageUrl = imageUrl,
//     this._id = id,
//     this._userId = userId
//   }

//   save() {
//     const db = getDB()
//     let prod;
//     console.log('the save', this)

//     if (this._id) {
//       prod = db.collection('products').updateOne({ _id: this._id }, { $set: this })
//       console.log('updated')

//     }
//     else {
//       prod = db.collection('products').insertOne(this)
//     }
//     return prod
//       .then(result => {
//       })
//       .catch(err => console.log('err from db save', err))


//   }

//   static fetchAll() {
//     const db = getDB()

//     return db.collection('products').find().toArray()
//   }

//   static findById(prodId) {
//     const db = getDB()

//     return db.collection('products').findOne({ _id: new Mongodb.ObjectId(prodId) })
//   }

//   static deleteOne(prodId) {
//     const db = getDB()

//     return db.collection('products').deleteOne({ _id: new Mongodb.ObjectId(prodId) })
//   }
// }



// module.exports = Product