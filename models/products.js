const fs = require('fs')
const path = require('path')

module.exports = class Products {
    constructor(bookTitle) {
        this.title = bookTitle
        this.title = bookTitle
    }

    save() {
        const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json')

        fs.readFile(p, (err, fileContents) => {
            let products = []
            if (!err) {
             products = JSON.parse(fileContents)
            }

            products.push(this)
            fs.writeFile(p, JSON.stringify(products), (er, file) => {
                console.log('This is the error', er)
            })
        })
    }

    static fetchAll(cb) {
        const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json')

        fs.readFile(p, (err, fileContents) => {
            if(err){
                cb([])
            }
            cb(JSON.parse(fileContents))
        })
    }
}