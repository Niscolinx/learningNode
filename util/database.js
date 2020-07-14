
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://munisco:munisco6869@cluster0.zhgsa.mongodb.net/learningNode?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true });

const MongoConnect = (cb) => {
    client.connect(err => {
        const collection = client.db("test").collection("devices");
        console.log('the err',err)
        cb(collection)
        client.close();
    });
}


// const MongoConnect = (cb) => {
//     MongoClient.connect('mongodb + srv://munisco:munisco6869@cluster0.zhgsa.mongodb.net/learningNode?retryWrites=true&w=majority')
//         .then(client => {
//             console.log('connected', client)
//             cb(client)
//         })
//         .catch(err => console.log('err connecting', err))
// }

module.exports = MongoConnect