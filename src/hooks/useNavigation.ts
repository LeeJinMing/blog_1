import { useRouter } from "next/navigation";

export const useNavigation = () => {
  const router = useRouter();

  const goBack = (fallbackPath: string = "/") => {
    // 检查浏览器历史记录
    if (typeof window !== "undefined") {
      // 如果有历史记录且不是第一个页面
      if (window.history.length > 1 && document.referrer) {
        router.back();
      } else {
        // 如果没有历史记录，跳转到fallback路径
        router.push(fallbackPath);
      }
    } else {
      // 服务端渲染时的fallback
      router.push(fallbackPath);
    }
  };

  return { goBack, router };
};
