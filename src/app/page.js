import dayjs from 'dayjs'
import Link from 'next/link'
import { findManyPosts } from '@/lib/mongo'

// 格式化日期为 YYYYMMDD
function formatDateToYYYYMMDD (dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}${month}${day}`
}

export default async function HomePage () {
  const postsToDisplay = await findManyPosts('posts', 5)

  // console.log(postsToDisplay)

  return (
    <main>
      <h1>我的博客1</h1>
      <div>
        {postsToDisplay.map((post) => {
          const yyyymmdd = formatDateToYYYYMMDD(post.createdAt) // 获取 YYYYMMDD 格式
          const postUrl = `/posts/${yyyymmdd}/${post.slug}`

          return (
            <article key={post._id.toString()}>
              <Link href={postUrl}>
                <h2>{post.title}</h2>
              </Link>
              <p>{dayjs(post.createdAt).format('YYYY-MM-DD')}</p>
              <p>{post.summary || '暂无摘要'}</p>
            </article>
          )
        })}
      </div>
    </main>
  )
}
