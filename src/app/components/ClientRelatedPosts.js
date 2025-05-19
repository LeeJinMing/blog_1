"use client";

import dynamic from "next/dynamic";

// Dynamic import of the RelatedPosts component
const RelatedPosts = dynamic(() => import("./RelatedPosts"), {
  ssr: false,
});

/**
 * Client component wrapper for RelatedPosts
 */
export default function ClientRelatedPosts({ currentPost }) {
  return <RelatedPosts currentPost={currentPost} />;
}
