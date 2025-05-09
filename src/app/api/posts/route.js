import { insertPost } from '@/lib/db'

export async function POST (request) {
  if (request.headers.get('Authorization') !== process.env.API_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const post = request.body
  console.log(post)
  post.createdAt = new Date()
  await insertPost(post)
  return Response.json(post)
}
