"use client"; // This tag indicates that this is a client component

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import EnhancedSidebar in the client component
const EnhancedSidebar = dynamic(() => import("./EnhancedSidebar"), {
  ssr: false,
  loading: () => <div className="sidebar-loading">Loading...</div>,
});

/**
 * Client-side sidebar container
 * The purpose of this component is to move the dynamic import logic to a client component,
 * as the `ssr: false` option is not allowed in server components
 */
export default function SidebarContainer() {
  // Can add any client-side logic here, such as state management
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Confirm that we are now in a client environment
    setIsClient(true);
  }, []);

  // Render the enhanced sidebar
  return <EnhancedSidebar />;
}
