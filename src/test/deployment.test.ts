import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

vi.mock("@lovable.dev/vite-tanstack-config", () => ({
  defineConfig: (options: unknown) => options,
}));

import config from "../../vite.config";

const options = config as unknown as {
  nitro: boolean;
  vite: { base: string; environments: Record<string, { build: { outDir: string } }> };
  tanstackStart: { spa: { enabled: boolean; maskPath: string; prerender: { outputPath: string } } };
};

describe("GitHub Pages deployment", () => {
  it("uses the domain root for absolute asset URLs", () => {
    expect(options.vite.base).toBe("/");
  });

  it("exports the static shell as dist/index.html without a server artifact", () => {
    expect(options.nitro).toBe(false);
    expect(options.vite.environments["client"]?.build.outDir).toBe("dist");
    expect(options.vite.environments["ssr"]?.build.outDir).toBe(".output/server");
    expect(options.tanstackStart.spa.enabled).toBe(true);
    expect(options.tanstackStart.spa.maskPath).toBe("/");
    expect(options.tanstackStart.spa.prerender.outputPath + ".html").toBe("/index.html");
  });

  it("copies the shell to the clean-URL fallback after building and uploads dist", () => {
    const workflow = readFileSync(".github/workflows/deploy.yml", "utf8");
    expect(workflow).toContain("      - run: npm run build\n      - run: cp dist/index.html dist/404.html\n      - uses: actions/upload-pages-artifact@v3\n        with:\n          path: dist\n");
    expect(workflow).toContain("          node-version: 20\n");
    expect(workflow).toContain("    branches: [main]\n");
  });
});