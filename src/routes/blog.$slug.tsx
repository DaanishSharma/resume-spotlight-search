import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { SiteHeader } from "@/components/SiteHeader";
import { usePosts } from "@/hooks/use-posts";
import { formatDate } from "@/lib/posts";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} · Daanish Sharma` },
      { name: "description", content: "A post by Daanish Sharma on applied AI and data infrastructure." },
      { property: "og:title", content: `${params.slug.replace(/-/g, " ")} · Daanish Sharma` },
      { property: "og:description", content: "A post by Daanish Sharma on applied AI and data infrastructure." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PostPage,
});

function Pre({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative">
      <button
        aria-label="Copy code"
        onClick={() => {
          navigator.clipboard.writeText(ref.current?.innerText ?? "");
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="absolute right-2 top-2 rounded border border-border bg-background/80 p-1.5 text-muted-foreground hover:text-foreground"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre ref={ref}>{children}</pre>
    </div>
  );
}

function PostPage() {
  const { slug } = Route.useParams();
  const { data: posts, isLoading } = usePosts();
  const post = posts?.find((p) => p.slug === slug);
  return (
    <div className="fade-in">
      <SiteHeader />
      <main className="mx-auto max-w-[680px] px-6 py-12">
        <Link to="/blog" className="font-mono text-xs text-muted-foreground hover:text-accent">
          ← blog
        </Link>
        {isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading.</p>
        ) : !post ? (
          <p className="mt-10 text-sm text-muted-foreground">This post could not be found.</p>
        ) : (
          <article className="mt-8">
            <title>{`${post.title} · Daanish Sharma`}</title>
            <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              {formatDate(post.date)} · {post.readMinutes} min read
            </p>
            <div className="prose-site mt-10">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={{ pre: Pre }}>
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
