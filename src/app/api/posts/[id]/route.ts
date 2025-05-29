import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    let post;

    // 首先尝试作为 MongoDB ObjectId 查找
    if (mongoose.Types.ObjectId.isValid(id)) {
      post = await Post.findById(id).exec();

      if (post) {
        // 增加浏览次数
        await Post.findByIdAndUpdate(id, { $inc: { views: 1 } });
      }
    } else {
      // 如果不是有效的 ObjectId，尝试作为 slug 查找
      post = await Post.findOne({ slug: id }).exec();

      if (post) {
        // 增加浏览次数
        await Post.findOneAndUpdate({ slug: id }, { $inc: { views: 1 } });
      }
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}
