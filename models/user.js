const MongoDb = require('mongodb')
const {getDB} = require('../util/database')

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

    }
}

module.exports = User