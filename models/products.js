const fs = require('fs')
const path = require('path')


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
    constructor(bookTitle, description, price, imgUrl, id) {
        this.title = bookTitle
        this.description = description
        this.price = price
        this.imgUrl = imgUrl
        this.id = id
    }

    save() {
        getItemsFromFile(products => {
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), (er, file) => {
                console.log('This is the error from saving product', er, file)
            })

        })   
    }



    static fetchAll(cb) {
       getItemsFromFile(cb)
    }
}


