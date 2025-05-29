import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/lib/models/Post";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");

    let query = {};
    if (category) {
      query = { category: { $regex: category, $options: "i" } };
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit ? parseInt(limit) : 50)
      .select(
        "title content excerpt category tags slug author publishedAt createdAt updatedAt image views readTime difficulty income trending featured"
      )
      .exec();

    return NextResponse.json({
      success: true,
      data: posts,
      count: posts.length,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
