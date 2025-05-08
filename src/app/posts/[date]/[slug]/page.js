import Link from 'next/link'
import { notFound } from 'next/navigation'
import { findOneBySlug, connectToDatabase } from '@/lib/mongo'

// 格式化日期为 YYYYMMDD
function formatDateToYYYYMMDD (dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}${month}${day}`
}

// 生成静态参数
export async function generateStaticParams () {
  try {
    const db = await connectToDatabase()
    const posts = await db.collection('posts').find({}, { projection: { slug: 1, createdAt: 1 } }).toArray()

    return posts.map((post) => ({
      date: formatDateToYYYYMMDD(post.createdAt),
      slug: post.slug
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// 获取帖子数据
async function getPostData ({ date: yyyymmddParam, slug: slugParam }) {
  try {
    const post = await findOneBySlug('posts', slugParam)
    if (!post) return null

    // 验证日期匹配
    const postDateFormatted = formatDateToYYYYMMDD(post.createdAt)
    if (postDateFormatted !== yyyymmddParam) return null

    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export default async function PostPage ({ params }) {
  const { date, slug } = await params
  const post = await getPostData({ date, slug })

  if (!post) {
    notFound()
  }

  const displayDate = new Date(post.createdAt)
  const displayYear = displayDate.getFullYear()
  const displayMonth = (displayDate.getMonth() + 1).toString().padStart(2, '0')
  const displayDay = displayDate.getDate().toString().padStart(2, '0')

  return (
    <main>
      <div>
        <Link href='/'>← 返回列表</Link>
        <h1>{post.title}</h1>
        <p>发布于: {displayYear}-{displayMonth}-{displayDay} (URL Date: {date})</p>
        <div>{post.content || '这篇文章还没有详细内容。'}</div>
        {post.summary && (
          <div>
            <h2>摘要</h2>
            <p>{post.summary}</p>
          </div>
        )}
        {post.tags && post.tags.length > 0 && (
          <div>
            <h2>标签</h2>
            <ul>
              {post.tags.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
          </div>
        )}
        {post.links && post.links.length > 0 && (
          <div>
            <h2>参考链接</h2>
            <ul>
              {post.links.map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}
