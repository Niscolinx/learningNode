const fs = require('fs')

const products_store = []
module.exports = class Products {
    constructor(bookTitle){
        this.title = bookTitle
    }

    save(){
        products_store.push(this)
    }

    fetchAll(){
        return products_store
    }
}