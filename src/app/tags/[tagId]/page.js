import { Suspense } from "react";
import { getPosts } from "../../../lib/db";
import Link from "next/link";
import PostCard from "../../components/PostCard";
import GlobalLayout from "../../components/GlobalLayout";
import Pagination from "../../components/Pagination";
import { getTagTextById } from "../../../lib/tags";

// 修改ISR缓存时间为20分钟，以便更及时地获取新数据
export const revalidate = 1200; // 20 分钟

// 根据标签ID获取相关文章
async function getTagPosts(tagId) {
  // 获取所有文章
  const allPosts = await getPosts(500);

  // 获取标签文本
  const tagText = getTagTextById(tagId);

  // 过滤包含该标签的文章
  const filteredPosts = allPosts.filter((post) => {
    // 检查文章标签
    if (post.tagIds && post.tagIds.length > 0) {
      // 直接匹配标签ID
      if (post.tagIds.includes(tagId)) return true;

      // 根据标签文本匹配文章
      for (const postTagId of post.tagIds) {
        const postTagText = getTagTextById(postTagId);
        if (postTagText.toLowerCase().includes(tagText.toLowerCase())) {
          return true;
        }
      }
    }

    // 检查标题是否包含标签文本
    if (
      post.title &&
      typeof post.title === "string" &&
      post.title.toLowerCase().includes(tagText.toLowerCase())
    ) {
      return true;
    }

    // 检查内容是否包含标签文本
    if (
      post.content &&
      typeof post.content === "string" &&
      post.content.toLowerCase().includes(tagText.toLowerCase())
    ) {
      return true;
    }

    return false;
  });

  return filteredPosts;
}

// 生成元数据
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const tagId = resolvedParams.tagId;
  const tagText = getTagTextById(tagId);

  return {
    title: `${tagText} - Related Articles`,
    description: `Browse all articles and content related to "${tagText}"`,
  };
}

// 页面组件
export default async function TagPage({ params, searchParams }) {
  // 安全获取参数
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const tagId = resolvedParams.tagId;

  // 获取当前页码，默认为第1页
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const pageSize = 10; // 每页显示文章数量

  // 获取与此标签相关的文章
  const allTagPosts = await getTagPosts(tagId);

  // 计算分页
  const totalPosts = allTagPosts.length;
  const totalPages = Math.ceil(totalPosts / pageSize);

  // 获取当前页的文章
  const startIndex = (currentPage - 1) * pageSize;
  const posts = allTagPosts.slice(startIndex, startIndex + pageSize);

  // 获取标签文本
  const tagText = getTagTextById(tagId);

  return (
    <GlobalLayout>
      <section className="hero">
        <h1>{tagText}</h1>
        <p className="subtitle">All articles related to "{tagText}"</p>
      </section>

      <section className="post-list">
        {posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}

            {/* 分页组件 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/tags/${tagId}`}
            />
          </>
        ) : (
          <div className="no-posts">
            <p>No articles related to "{tagText}" were found.</p>
            <Link href="/" className="back-link">
              Back to Home
            </Link>
          </div>
        )}
      </section>
    </GlobalLayout>
  );
}
