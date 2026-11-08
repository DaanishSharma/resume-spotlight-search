import { BLOG_REPO } from "@/config";

export type PostMeta = {
  slug: string;
  file: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
};
export type Post = PostMeta & { content: string; readMinutes: number };

const rawBase = () =>
  `https://raw.githubusercontent.com/${BLOG_REPO.owner}/${BLOG_REPO.repo}/${BLOG_REPO.branch}/${BLOG_REPO.postsDir}`;
const CACHE_KEY = `posts:${BLOG_REPO.owner}/${BLOG_REPO.repo}`;

export function slugFromFile(file: string) {
  return file.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function parseValue(v: string): unknown {
  const t = v.trim();
  if (t.startsWith("[")) {
    try {
      return JSON.parse(t.replace(/'/g, '"'));
    } catch {
      return t.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    }
  }
  return t.replace(/^["']|["']$/g, "");
}

/** Minimal YAML frontmatter parser (flat key: value, inline arrays). */
export function parseFrontmatter(src: string): { data: Record<string, unknown>; content: string } {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, content: src };
  const data: Record<string, unknown> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = parseValue(line.slice(i + 1));
  }
  return { data, content: m[2] };
}

function toPost(file: string, raw: string): Post {
  const { data, content } = parseFrontmatter(raw);
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    file,
    slug: slugFromFile(file),
    title: String(data.title ?? slugFromFile(file)),
    date: String(data.date ?? file.slice(0, 10)),
    excerpt: String(data.excerpt ?? ""),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    content,
    readMinutes: Math.max(1, Math.round(words / 220)),
  };
}

export async function fetchPosts(): Promise<Post[]> {
  if (typeof window !== "undefined") {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
  }
  try {
    const res = await fetch(
      `https://api.github.com/repos/${BLOG_REPO.owner}/${BLOG_REPO.repo}/contents/${BLOG_REPO.postsDir}?ref=${BLOG_REPO.branch}`,
    );
    if (!res.ok) return [];
    const list = (await res.json()) as { name: string; type: string }[];
    const files = list.filter((f) => f.type === "file" && f.name.endsWith(".md")).map((f) => f.name);
    const posts = await Promise.all(
      files.map(async (f) => {
        const r = await fetch(`${rawBase()}/${f}`);
        return r.ok ? toPost(f, await r.text()) : null;
      }),
    );
    const sorted = posts.filter((p): p is Post => !!p).sort((a, b) => b.date.localeCompare(a.date));
    if (typeof window !== "undefined") sessionStorage.setItem(CACHE_KEY, JSON.stringify(sorted));
    return sorted;
  } catch {
    return [];
  }
}

export function formatDate(d: string) {
  const dt = new Date(d + "T00:00:00Z");
  return isNaN(+dt) ? d : dt.toISOString().slice(0, 10);
}
