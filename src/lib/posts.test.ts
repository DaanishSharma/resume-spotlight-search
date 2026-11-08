import { describe, expect, it } from "vitest";
import { parseFrontmatter, slugFromFile } from "./posts";

describe("posts", () => {
  it("strips date prefix and .md from slug", () => {
    expect(slugFromFile("2026-11-08-hello-world.md")).toBe("hello-world");
  });
  it("parses frontmatter fields", () => {
    const { data, content } = parseFrontmatter(
      '---\ntitle: "Hello world"\ndate: "2026-11-08"\ntags: ["meta"]\n---\nBody',
    );
    expect(data.title).toBe("Hello world");
    expect(data.tags).toEqual(["meta"]);
    expect(content).toBe("Body");
  });
});
