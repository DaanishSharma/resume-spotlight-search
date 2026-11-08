import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { usePosts } from "@/hooks/use-posts";
import { formatDate } from "@/lib/posts";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog · Daanish Sharma" },
      { name: "description", content: "Notes on LLM evaluation, data infrastructure, and ML from first principles." },
      { property: "og:title", content: "Blog · Daanish Sharma" },
      { property: "og:description", content: "Notes on LLM evaluation, data infrastructure, and ML from first principles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { data: posts, isLoading } = usePosts();
  return (
    <div className="fade-in">
      <SiteHeader />
      <main className="mx-auto max-w-[680px] px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Writing</h1>
        <div className="mt-10">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading posts.</p>
          ) : !posts?.length ? (
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {posts.map((p) => (
                <li key={p.slug} className="py-5">
                  <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block">
                    <span className="font-mono text-xs text-muted-foreground">{formatDate(p.date)}</span>
                    <h2 className="mt-1 font-medium group-hover:text-accent">{p.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{p.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
