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
        
        return db.collection('users').findOne({username: this.username})
        .then(userExists => {
            let userData;

            if(userExists === null){
                return db.collection('users').insertOne(this)
                .then(userCreated => {
                    console.log('user created', userCreated.ops)
                    userData = userCreated.ops
                })
                .catch(err => {console.log('failed to create user', err)})
            }
            else{
                console.log('user found', userExists)
                userData = userExists
            }
            return userData
        })
        .catch(userNotFound => {
            console.log('user does not exist', userNotFound)
        })  
    }

    static findById(userId){
        const db = getDB()
        console.log('id', userId)
        return db.collection('users').findOne({_id: new MongoDb.ObjectId(userId)})
        .then(res => {
            console.log('Adding the id ', res)
            return res
        })
        .catch(err => {
            console.log('Error adding the product', err)
        })
    }
}

module.exports = User