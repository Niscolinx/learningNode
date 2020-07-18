const MongoDb = require('mongodb')
const {getDB} = require('../util/database')
const { get } = require('../routes/shop')

class User {
    constructor(username, email){
        this.username = username,
        this.email = email
    }

    save(){
        const db = getDB()

        return db.collection('users').insertOne(this)
        
    }

    static findById(userId){
        const db = getDB()

        return db.collection('users').find({_id: new MongoDb.ObjectId(userId)}).toArray()
    }
}

module.exports = User