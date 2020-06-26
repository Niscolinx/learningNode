const fs = require('fs')
const path = require('path')
const { json } = require('body-parser')

const products_store = []
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json')
module.exports = class Products {
    constructor(bookTitle) {
        this.title = bookTitle
    }

    save() {
        fs.readFile(p, (err, fileContents) => {
            let products = []
            if (!err) {
                products = JSON.parse(fileContents)
                console.log('the inner products', products)
            }

            products.push(this)
            console.log('the products', products)
            fs.writeFile(p, JSON.stringify(products), (er, file) => {
                console.log('This is the error', er)
            })
        })
        products_store.push(this)
    }

    fetchAll() {
        fs.readFile(p, (err, fileContents) => {
            if(err){
                console.log(err)
            }
            return JSON.parse(fileContents)
        })
        return products_store
    }
}