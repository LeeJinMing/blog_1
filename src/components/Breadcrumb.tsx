import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex ${className}`}>
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {/* 首页链接 */}
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            <HomeIcon className="w-3 h-3 me-2.5" />
            Home
          </Link>
        </li>

        {/* 动态面包屑项 */}
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            <ChevronRightIcon className="w-3 h-3 text-gray-400 mx-1" />
            {item.current ? (
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate max-w-[200px] md:max-w-none">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white truncate max-w-[200px] md:max-w-none"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// 预定义的面包屑生成器
export const BreadcrumbGenerators = {
  // 文章页面面包屑
  forPost: (post: { title: string; category?: string; slug?: string; _id?: string }): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];

    if (post.category) {
      const categorySlug = post.category.toLowerCase().replace(/\s+/g, '-');
      items.push({
        name: post.category,
        href: `/category/${categorySlug}`,
      });
    }

    items.push({
      name: post.title,
      href: `/post/${post.slug || post._id}`,
      current: true,
    });

    return items;
  },

  // 分类页面面包屑
  forCategory: (categoryName: string, categorySlug: string): BreadcrumbItem[] => [
    {
      name: categoryName,
      href: `/category/${categorySlug}`,
      current: true,
    },
  ],

  // Income Streams 页面面包屑
  forIncomeStream: (title: string, slug: string): BreadcrumbItem[] => [
    {
      name: 'Income Streams',
      href: '/category/income-streams',
    },
    {
      name: title,
      href: `/income-streams/${slug}`,
      current: true,
    },
  ],

  // 静态页面面包屑
  forStaticPage: (pageName: string, slug: string): BreadcrumbItem[] => [
    {
      name: pageName,
      href: `/${slug}`,
      current: true,
    },
  ],

  // 搜索结果页面面包屑
  forSearch: (query: string): BreadcrumbItem[] => [
    {
      name: `Search: "${query}"`,
      href: `/search?q=${encodeURIComponent(query)}`,
      current: true,
    },
  ],
};

// 智能面包屑组件 - 根据当前路径自动生成
export function SmartBreadcrumb({
  pathname,
  customItems
}: {
  pathname: string;
  customItems?: BreadcrumbItem[];
}) {
  if (customItems) {
    return <Breadcrumb items={customItems} />;
  }

  // 根据路径自动生成面包屑
  const pathSegments = pathname.split('/').filter(segment => segment);
  const items: BreadcrumbItem[] = [];

  pathSegments.forEach((segment, index) => {
    const isLast = index === pathSegments.length - 1;
    const href = '/' + pathSegments.slice(0, index + 1).join('/');

    // 转换路径段为可读名称
    let name = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // 特殊处理某些路径
    if (segment === 'money-making') name = 'Money Making';
    if (segment === 'income-streams') name = 'Income Streams';
    if (segment === 'post') name = 'Articles';

    items.push({
      name,
      href,
      current: isLast,
    });
  });

  return <Breadcrumb items={items} />;
} 