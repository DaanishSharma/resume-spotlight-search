import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/lib/posts";

export function usePosts() {
  return useQuery({ queryKey: ["posts"], queryFn: fetchPosts, staleTime: Infinity, retry: false });
}
