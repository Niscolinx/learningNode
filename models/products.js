const fs = require('fs')
const path = require('path')

const products_store = []
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json')
module.exports = class Products {
    constructor(bookTitle) {
        this.title = bookTitle
    }

    save() {

        fs.readFile(p, (err, fileContents) => {
            if (err) {
                 fs.writeFile(p, fileContents, (er, file) => {
                   console.log('This is the error', er)
                })
                console.log('The error', err)
            }
        })
        //products_store.push(this)
    }

    fetchAll() {
        return products_store
    }
}