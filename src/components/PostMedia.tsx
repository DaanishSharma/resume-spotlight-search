import type { ComponentProps } from "react";
import type { Components } from "react-markdown";
import { BLOG_REPO } from "@/config";

/** Base URL that relative media paths in posts resolve against. */
export const POST_MEDIA_BASE = `https://raw.githubusercontent.com/${BLOG_REPO.owner}/${BLOG_REPO.repo}/${BLOG_REPO.branch}/${BLOG_REPO.postsDir}/`;

const VIDEO_EXT = /\.(mp4|webm)$/i;

/** Absolute URLs (and data/blob URLs) pass through; anything else resolves against the posts folder. */
export function resolveMediaUrl(src: string): string {
  if (/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(src)) return src;
  return new URL(src.replace(/^\.\//, ""), POST_MEDIA_BASE).toString();
}

export function isVideoUrl(src: string): boolean {
  return VIDEO_EXT.test(src.split(/[?#]/)[0] ?? "");
}

/** Returns the video id for youtube.com/watch?v=… and youtu.be/… links, else null. */
export function youtubeId(href: string): string | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.)/, "");
  let id: string | null = null;
  if (host === "youtube.com" && url.pathname === "/watch") id = url.searchParams.get("v");
  else if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0] ?? null;
  return id && /^[\w-]{6,}$/.test(id) ? id : null;
}

export function YouTubeEmbed({ id, title }: { id: string; title?: string | undefined }) {
  return (
    <div className="my-6 aspect-video w-full overflow-hidden rounded-md border border-border">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title || "YouTube video"}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

function MediaImg({ src, alt, title }: ComponentProps<"img">) {
  if (typeof src !== "string" || !src) return null;
  const yt = youtubeId(src);
  if (yt) return <YouTubeEmbed id={yt} title={alt || title} />;
  const url = resolveMediaUrl(src);
  if (isVideoUrl(url)) {
    return (
      <video
        className="my-6 w-full rounded-md"
        src={url}
        controls
        playsInline
        preload="metadata"
        title={alt || title}
      >
        {alt}
      </video>
    );
  }
  return (
    <img
      src={url}
      alt={alt ?? ""}
      title={title}
      loading="lazy"
      className="h-auto max-w-full rounded-md"
    />
  );
}

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function textOf(node: HastNode): string {
  return node.value ?? (node.children ?? []).map(textOf).join("");
}

/** The lone element in a paragraph, ignoring whitespace, or null. */
function soleChild(node: HastNode | undefined): HastNode | null {
  const kids = (node?.children ?? []).filter((c) => !(c.type === "text" && !c.value?.trim()));
  return kids.length === 1 ? kids[0]! : null;
}

/**
 * Markdown components for blog posts:
 * - images ending in .mp4/.webm render as <video>, YouTube image URLs as embeds;
 * - a paragraph holding only a YouTube link renders as an embed (inline links stay links);
 * - relative media paths resolve against the blog repo's posts folder.
 */
export const mediaComponents: Components = {
  img: ({ node: _node, ...props }) => <MediaImg {...props} />,
  p: ({ node, children, ...props }) => {
    const only = soleChild(node as HastNode | undefined);
    if (only?.tagName === "a") {
      const yt = youtubeId(String(only.properties?.["href"] ?? ""));
      if (yt) return <YouTubeEmbed id={yt} title={textOf(only)} />;
    }
    // Videos and embeds are block elements, so a paragraph holding only an image becomes a div.
    if (only?.tagName === "img") return <div>{children}</div>;
    return <p {...props}>{children}</p>;
  },
};
