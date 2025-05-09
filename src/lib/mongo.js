import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_REMOTE_URL

// 共用的数据库连接函数
async function connectMongo () {
  try {
    const client = await MongoClient.connect(uri, { connectTimeoutMS: 5000 })
    console.log('Connected to MongoDB')
    return client
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error
  }
}

// 根据 slug 查找单个文档
async function findOneBySlug (collectionName, slug) {
  if (!collectionName || !slug) {
    throw new Error('collectionName and slug are required')
  }

  let client
  try {
    client = await connectMongo()
    const collection = client.db().collection(collectionName)
    const result = await collection.findOne({ slug })
    console.log(`findOneBySlug(${collectionName}, ${slug}):`, !!result)
    return result
  } catch (error) {
    console.error(`Error finding document by slug in ${collectionName}:`, error)
    throw error
  } finally {
    if (client) {
      await client.close()
      console.log('MongoDB connection closed for findOneBySlug')
    }
  }
}

// 插入一个帖子
async function insertOnePost (collectionName, post) {
  if (!collectionName || !post) {
    throw new Error('collectionName and post are required')
  }

  let client
  try {
    client = await connectMongo()
    const collection = client.db().collection(collectionName)
    const result = await collection.insertOne(post)
    console.log(`insertOnePost(${collectionName}):`, result.insertedId)
    return result
  } catch (error) {
    console.error(`Error inserting post to ${collectionName}:`, error)
    throw error
  } finally {
    if (client) {
      await client.close()
      console.log('MongoDB connection closed for insertOnePost')
    }
  }
}

// 查找多个帖子
async function findManyPosts (collectionName, limit = 5) {
  if (!collectionName) {
    throw new Error('collectionName is required')
  }
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error('limit must be a positive integer')
  }

  let client
  try {
    client = await connectMongo()
    const collection = client.db().collection(collectionName)
    const result = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
    console.log(`findManyPosts(${collectionName}, ${limit}):`, result.length)
    return result
  } catch (error) {
    console.error(`Error finding posts in ${collectionName}:`, error)
    throw error
  } finally {
    if (client) {
      await client.close()
      console.log('MongoDB connection closed for findManyPosts')
    }
  }
}

export { findOneBySlug, insertOnePost, findManyPosts }
