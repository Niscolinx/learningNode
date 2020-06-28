const fs = require('fs')
const path = require('path')
const e = require('express')


const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json') 

const getItemsFromFile = cb => {

    fs.readFile(p, (err, fileContents) => {
        if (err) {
            cb([])
        }
        else{
            cb(JSON.parse(fileContents))
        }
    })
}
module.exports = class Products {
    constructor(bookTitle) {
        this.title = bookTitle
    }

    save() {
        getItemsFromFile(products => {
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), (er, file) => {
                console.log('This is the error', er, file)
            })

        })
           
    }

    static fetchAll(cb) {
       getItemsFromFile(cb)
    }
}