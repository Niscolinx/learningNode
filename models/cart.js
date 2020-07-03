const fs = require('fs')
const path = require('path')


const cartPath = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json')
const totalPricePath = path.join(path.dirname(process.mainModule.filename), 'data', 'totalPrice.json')

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
const getTotalPrice = tb => {

    fs.readFile(totalPricePath, (err, fileContents) => {
        if (err) {
            tb([])
        }
        else {
            tb(JSON.parse(fileContents))
        }
    })
}

module.exports = class Cart {
    constructor(bookTitle, price, imgUrl, id) {
        this.title = bookTitle
        this.price = price
        this.imgUrl = imgUrl
        this.id = id
    }

    save() {
        getItemsFromCart(cart => {
            cart.push(this)
            console.log('This is the cart item', cart)
            fs.writeFile(cartPath, JSON.stringify(cart), err => {
                console.log('The error from saving the cart item', err)
            })

        })

    }

    static updateAll() {
        getItemsFromCart(cart => {
            let total = 0
            for (let item of cart) {
                total += Math.floor(Number(item.price))
            }
            cart.push({totalPrice: total})
            console.log('This is the update cart', cart)
            fs.writeFile(totalPricePath, JSON.stringify(cart), err => {
                console.log('The error from saving the cart item', err)
            })

        })

    }

    remove(id) {
        getItemsFromCart(cart => {
            const newItems = cart.filter(cartItem => {
                return cartItem.id !== id
            })
            cart = newItems
            fs.writeFile(cartPath, JSON.stringify(cart), err => {
                console.log('The error from removing the cart', err)
            })
        })
    }

    // static getAllPrices(){
    //   getItemsFromCart(cartItem => {
    //         let total = 0
    //         for(let item of cartItem){
    //             total += Math.floor(Number(item.price))
    //         }
    //         cartItem.push({totalPrice: total})
    //         console.log('print total cb', this.title)
    //     })
    // }

    static fetchAll(cb) {
        getItemsFromCart(cb)
    }
}