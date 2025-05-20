"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// 动态导入LikeButton组件
const LikeButton = dynamic(() => import("./LikeButton"), {
  ssr: false,
  loading: () => <div className="loading-placeholder">Loading...</div>,
});

export default function LikeButtonWrapper({ postId, slug }) {
  return (
    <Suspense fallback={<div className="loading-placeholder">Loading...</div>}>
      <LikeButton postId={postId} slug={slug} />
    </Suspense>
  );
}
