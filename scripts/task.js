require('dotenv').config()

const mongo = require('./mongo')

const { generateArticle } = require('./article')
const { generatePost } = require('./generator')

async function createPost (keyword) {
  try {
    console.log('Generating article...')
    const article = await generateArticle(keyword)
    console.log(article)
    console.log('Generating post...')
    const post = await generatePost(article)
    console.log(post)
    console.log('Saving post...')
    post.createdAt = new Date()
    const result = await mongo.db().collection('posts').insertOne(post)
    console.log(result)
  } catch (error) {
    console.error(error)
  } finally {
    await mongo.close()
  }
}

createPost('AI')
