const cartPath = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json') 


const getItemsFromCart = cb => {

    fs.readFile(cartPath, (err, fileContents) => {
        if (err) {
            cb([])
        }
        else {
            cb(JSON.parse(fileContents))
        }
    })
}

module.exports = class Cart {
    constructor(bookTitle, id) {
        this.title = bookTitle
        this.id = id
    }

    save() {
        getItemsFromCart(cart => {
            cart.push(this)
            fs.writeFile(p, JSON.stringify(cart), (er, file) => {
                console.log('This is the error', er, file)
            })

        })

    }


    static fetchAll(cb) {
        getItemsFromCart(cb)
    }
}