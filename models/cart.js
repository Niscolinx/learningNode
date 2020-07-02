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
            console.log('This is the cart item', cart)
            fs.writeFile(cartPath, JSON.stringify(cart), err => {
                console.log('The error from saving the cart item',err)
            })

        })

    }

    remove(id){
        getItemsFromCart(cart => {
           const newItems =  cart.filter(cartItem => {
               return cartItem.id !== id
            })
            cart = newItems
            fs.writeFile(cartPath, JSON.stringify(cart), err => {
                console.log('The error from removing the cart', err)
            })
        })
    }

    static getAllPrices(){
      getItemsFromCart(cartItem => {
            let total = 0
            for(let item of cartItem){
                total += Math.floor(Number(item.price))
            }
            cartItem.push({totalPrice: total})
          fs.writeFile(cartPath, JSON.stringify(cartItem), err => {
              console.log('The error from removing the cart', err)
          })
        })
    }

    static fetchAll(cb) {
        const totalprice = this.getAllPrices()
        console.log('the total price', totalprice)
        getItemsFromCart(cb)
    }
}