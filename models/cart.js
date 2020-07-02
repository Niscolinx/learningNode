const fs = require('fs')
const path = require('path')


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
    constructor(bookTitle, price, id) {
        this.title = bookTitle
        this.price = price
        this.id = id
    }

    save() {
        getItemsFromCart(cart => {
            cart.push(this)
            fs.writeFile(cartPath, JSON.stringify(cart), err => {
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

    static getTotalPrice() {
        const holdTotal = (cb) =>{
            console.log(cb) 
        }
       fs.readFile(cartPath, (err, fileContents) => {
            if (err) {
                holdTotal([])
            }
            else {
                holdTotal(JSON.parse(fileContents))
            }
        })

        console.log('the hold total', holdTotal)
        getItemsFromCart(cartItem => {
            let total = 0
            for (let item of cartItem) {
                total += Math.floor(Number(item.price))
            }
            cartItem.push({ totalPrice: total })
            console.log('the cart item', cartItem)
            // fs.writeFile(cartPath, JSON.stringify(cartItem), err => {
            //     console.log('The error from removing the cart', err)
            // })
        })
    }

    static fetchAll(cb) {
        this.getTotalPrice()
        getItemsFromCart(cb)
    }
}