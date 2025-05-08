import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_REMOTE_URL
let client
let db

// 数据库连接函数
async function connectToDatabase () {
  if (db) return db

  try {
    client = await MongoClient.connect(uri)
    db = client.db() // 使用默认数据库名称
    console.log('Successfully connected to MongoDB')
    return db
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error
  }
}

// 根据 slug 查找单个文档
async function findOneBySlug (collectionName, slug) {
  try {
    const database = await connectToDatabase()
    const collection = database.collection(collectionName)
    return await collection.findOne({ slug })
  } catch (error) {
    console.error(`Error finding document by slug in ${collectionName}:`, error)
    throw error
  }
}

// 查找多个帖子，按 createdAt 降序排序
async function findManyPosts (collectionName, limit = 5) {
  try {
    const database = await connectToDatabase()
    const collection = database.collection(collectionName)
    return await collection
      .find({})
      .sort({ createdAt: -1 }) // 按 createdAt 降序
      .limit(limit)
      .toArray()
  } catch (error) {
    console.error(`Error finding posts in ${collectionName}:`, error)
    throw error
  }
}

// 关闭数据库连接
async function closeConnection () {
  if (client) {
    await client.close()
    console.log('MongoDB connection closed')
  }
}

export { connectToDatabase, findOneBySlug, findManyPosts, closeConnection }
