const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    password_resetToken: String,
    password_resetToken_expiration: Date,
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
})

userSchema.methods.removeCart = function (prodId) {

    const newCart = this.cart.items.filter(p => {
        return p._id.toString() !== prodId.toString()
    })

    this.cart.items = newCart

    return this.save()
}

userSchema.methods.clearCart = function () {

    this.cart.items = []

    return this.save()
}

userSchema.methods.addToCart = function (prodId, price) {

    price = +price

    const productIdx = this.cart.items.findIndex(p => {
        return p.productId.toString() === prodId.toString()
    })

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items]

    if (productIdx >= 0) {
        newQuantity = this.cart.items[productIdx].quantity
        oldPrice = this.cart.items[productIdx].price
        updatedCartItems[productIdx].quantity = newQuantity + 1
        updatedCartItems[productIdx].price = oldPrice + price
    }
    else {
        updatedCartItems.push({
            productId: prodId,
            quantity: newQuantity,
            price: price
        })
    }
    const updatedCart = {
        items: updatedCartItems
    }

    this.cart = updatedCart

    return this.save()
}

module.exports = mongoose.model('users', userSchema)

