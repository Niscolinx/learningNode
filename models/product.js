const { getDB } = require('../util/database')

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
    // .then(res => {
    //   console.log('foundAll', res)
    // })
    // .catch(err => console.log('foundAll', err))
  }
}



module.exports = Product