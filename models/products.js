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
            const products = []
            if (!err) {
                products = JSON.parse(fileContents)
            }
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), (er, file) => {
                console.log('This is the error', er)
            })
        })
        //products_store.push(this)
    }

    fetchAll() {
        return products_store
    }
}