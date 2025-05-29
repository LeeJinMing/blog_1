import mongoose from "mongoose";

export interface IPost extends mongoose.Document {
  title: string;
  content: string;
  excerpt?: string;
  summary?: string; // 文章总结
  conclusion?: string; // 文章结论
  category?: string;
  tags?: string[];
  slug?: string;
  author?: string;
  publishedAt?: Date;
  updatedAt?: Date;
  image?: string;
  views?: number;
  readTime?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  income?: string;
  trending?: boolean;
  featured?: boolean;
  links?: string[]; // 相关链接
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  // 支持更灵活的字段结构
  [key: string]: any;
}

const PostSchema = new mongoose.Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    conclusion: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    slug: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String,
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: String,
      default: "5 min read",
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    income: {
      type: String,
      trim: true,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    links: [
      {
        type: String,
        trim: true,
      },
    ],
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
    seoKeywords: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    strict: false, // 允许额外字段
    collection: "posts", // 明确指定集合名称
  }
);

// 创建索引
PostSchema.index({ category: 1, publishedAt: -1 });
PostSchema.index({ slug: 1 });
PostSchema.index({ featured: 1, publishedAt: -1 });
PostSchema.index({ trending: 1, publishedAt: -1 });

export default mongoose.models.Post ||
  mongoose.model<IPost>("Post", PostSchema);
