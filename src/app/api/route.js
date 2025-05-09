import { insertOnePost } from '@/lib/mongo'

export async function POST (request) {
  const post = await request.json()
  console.log(post)
  post.createdAt = new Date()
  await insertOnePost('posts', post)
  return new Response('OK', { status: 200 })
}
