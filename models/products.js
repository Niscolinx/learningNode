const fs = require('fs')
const path = require('path')


const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json') 

const getItemsFromFile = cb => {

    fs.readFile(p, (err, fileContents) => {
        if (err) {
            cb([])
        }
        cb(JSON.parse(fileContents))
    })
}
module.exports = class Products {
    constructor(bookTitle) {
        this.title = bookTitle
    }

    save() {
      
        getItemsFromFile(products => {
            console.info('This is the product', products)
        })
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), (er, file) => {
                console.log('This is the error', er)
            })
    }

    static fetchAll(cb) {
       getItemsFromFile(cb)
    }
}