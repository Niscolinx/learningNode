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
    db.collection('products')
      .insertOne(this)
      .then(result => {
        console.log('the result from db', result)
      })
      .catch(err => console.log('err from db', err))
  }
}


module.exports = Product