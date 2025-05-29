const mongoose = require("mongoose");

// MongoDB 连接
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://localhost:27017/post-bot-2");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Post 模型
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: String,
    summary: String,
    conclusion: String,
    category: String,
    tags: [String],
    slug: String,
    author: String,
    publishedAt: Date,
    image: String,
    views: { type: Number, default: 0 },
    readTime: String,
    difficulty: String,
    income: String,
    trending: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    links: [String],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

// 测试函数
async function testDatabase() {
  try {
    await connectDB();

    console.log("\n=== 检查数据库中的文章 ===");
    const posts = await Post.find({}).limit(5);
    console.log(`找到 ${posts.length} 篇文章`);

    if (posts.length > 0) {
      console.log("\n前几篇文章：");
      posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title}`);
        console.log(`   ID: ${post._id}`);
        console.log(`   Slug: ${post.slug || "N/A"}`);
        console.log(`   Category: ${post.category || "N/A"}`);
        console.log("");
      });
    } else {
      console.log("数据库中没有文章");
    }

    // 测试 API 路由会用到的查询
    console.log("\n=== 测试按分类查询 ===");
    const moneyMakingPosts = await Post.find({
      category: { $regex: "money", $options: "i" },
    });
    console.log(`Money Making 分类文章数量: ${moneyMakingPosts.length}`);

    await mongoose.connection.close();
    console.log("\n数据库连接已关闭");
  } catch (error) {
    console.error("测试失败:", error);
    process.exit(1);
  }
}

testDatabase();
