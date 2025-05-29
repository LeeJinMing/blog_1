const mongoose = require("mongoose");

// MongoDB连接字符串
const MONGODB_URI =
  "mongodb+srv://limingjin777:wizard127811@cluster0.mfggtuk.mongodb.net/post-bot-2?retryWrites=true&w=majority";

// Post模型定义
const PostSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    excerpt: String,
    category: String,
    tags: [String],
    slug: String,
    author: String,
    publishedAt: Date,
    updatedAt: Date,
    image: String,
    views: Number,
    readTime: String,
    difficulty: String,
    income: String,
    trending: Boolean,
    featured: Boolean,
  },
  {
    timestamps: true,
    strict: false,
    collection: "posts",
  }
);

const Post = mongoose.model("Post", PostSchema);

async function testConnection() {
  try {
    console.log("🔌 正在连接MongoDB...");

    // 连接数据库
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: "post-bot-2",
    });

    console.log("✅ MongoDB连接成功！");

    // 获取总文章数
    const totalCount = await Post.countDocuments({});
    console.log(`📊 总文章数: ${totalCount}`);

    // 获取所有分类
    const categories = await Post.distinct("category");
    console.log(`📂 文章分类: ${categories.join(", ")}`);

    // 查找赚钱相关的文章
    const moneyMakingPosts = await Post.find({
      category: { $regex: "money", $options: "i" },
    }).limit(10);

    console.log(`💰 找到 ${moneyMakingPosts.length} 篇money-making相关文章:`);
    moneyMakingPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} (分类: ${post.category})`);
    });

    // 获取最新的几篇文章看看数据结构
    console.log("\n📝 最新的5篇文章:");
    const latestPosts = await Post.find({}).sort({ createdAt: -1 }).limit(5);
    latestPosts.forEach((post, index) => {
      console.log(
        `${index + 1}. ${post.title} (分类: ${post.category || "未分类"})`
      );
    });

    console.log(
      "\n🎯 测试完成！现在可以访问 http://localhost:3000/category/money-making 查看页面"
    );
  } catch (error) {
    console.error("❌ 错误:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB连接已断开");
  }
}

// 运行测试
testConnection();
