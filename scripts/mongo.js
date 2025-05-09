const { MongoClient } = require('mongodb')

const mongo = new MongoClient(process.env.MONGO_REMOTE_URL)

module.exports = mongo
