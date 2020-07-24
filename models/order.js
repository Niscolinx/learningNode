const mongoose = require('mongoose')
const { object } = require('mongoose/lib/utils')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    orders: [{
        cartProduct: {
            type: Object,
            required: true
        },
        quantity: {
            type: Number,
            requied: true
        },
        price: {
            type: Number,
            required: true
        }
    }],

    user: {
        name: {
            type: String,
            required: true
        },

        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        }
    }

})

module.exports = mongoose.model('orders', orderSchema)



