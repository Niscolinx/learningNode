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
        .then(user => {
            console.log('new user', user)
        })
        .catch(err => console.log('Failed to create a new user', err))
    }

    static findById(userId){

    }
}

module.exports = User