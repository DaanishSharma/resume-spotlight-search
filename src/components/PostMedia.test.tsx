import { render } from "@testing-library/react";
import ReactMarkdown from "react-markdown";
import { describe, expect, it } from "vitest";
import { POST_MEDIA_BASE, mediaComponents, resolveMediaUrl, youtubeId } from "./PostMedia";

const md = (src: string) =>
  render(<ReactMarkdown components={mediaComponents}>{src}</ReactMarkdown>).container;

describe("post media", () => {
  it("resolves relative paths against the blog posts folder", () => {
    expect(POST_MEDIA_BASE).toBe(
      "https://raw.githubusercontent.com/daanishsharma/blog/main/posts/",
    );
    expect(resolveMediaUrl("media/x.png")).toBe(`${POST_MEDIA_BASE}media/x.png`);
    expect(resolveMediaUrl("./media/x.png")).toBe(`${POST_MEDIA_BASE}media/x.png`);
    expect(resolveMediaUrl("https://example.com/a.mp4")).toBe("https://example.com/a.mp4");
  });

  it("parses YouTube ids", () => {
    expect(youtubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10")).toBe("dQw4w9WgXcQ");
    expect(youtubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(youtubeId("https://example.com/watch?v=dQw4w9WgXcQ")).toBeNull();
  });

  it("renders .mp4/.webm images as full-width videos outside a <p>", () => {
    const el = md("![demo](media/run.webm)");
    const video = el.querySelector("video")!;
    expect(video.getAttribute("src")).toBe(`${POST_MEDIA_BASE}media/run.webm`);
    expect(video.hasAttribute("controls")).toBe(true);
    expect(video.hasAttribute("playsinline")).toBe(true);
    expect(video.getAttribute("preload")).toBe("metadata");
    expect(video.className).toContain("w-full");
    expect(el.querySelector("p video")).toBeNull();
  });

  it("renders relative images with resolved src", () => {
    expect(md("![map](media/map.png)").querySelector("img")!.getAttribute("src")).toBe(
      `${POST_MEDIA_BASE}media/map.png`,
    );
  });

  it("embeds YouTube from an image or a standalone link, but not an inline link", () => {
    const embed = (s: string) => md(s).querySelector("iframe")?.getAttribute("src");
    expect(embed("![talk](https://youtu.be/dQw4w9WgXcQ)")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
    expect(embed("[talk](https://www.youtube.com/watch?v=dQw4w9WgXcQ)")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
    expect(embed("See [this talk](https://youtu.be/dQw4w9WgXcQ) for more.")).toBeUndefined();
  });
});
