import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import type { ModuleNode, Plugin } from "vite";

import type { Content } from "./types/content";
import { scanContents } from "./utils/content";
import { generateContentsModule } from "./utils/modules";

const VIRTUAL_MODULE_ID = "virtual:docs-contents";
const RESOLVED_VIRTUAL_ID = `\0${VIRTUAL_MODULE_ID}`;

interface DocsPluginOptions {
  contentsDir?: string;
  verbose?: boolean;
}

export default function docsPlugin(options: DocsPluginOptions = {}): Plugin[] {
  const { contentsDir = "content", verbose = true } = options;
  let allContentData: Record<string, Content[]> = {};

  const log = (msg: string) => {
    if (verbose) {
      console.log(`[docsPlugin] ${msg}`);
    }
  };

  const getSubdirectories = async (baseDir: string): Promise<string[]> => {
    try {
      const entries = await readdir(baseDir, { withFileTypes: true });
      return entries.filter((e) => e.isDirectory()).map((e) => e.name);
    } catch (err) {
      log(`Failed to read ${baseDir}: ${err}`);
      return [];
    }
  };

  const loadContents = async (root: string) => {
    const baseDir = resolve(root, contentsDir);
    const subdirs = await getSubdirectories(baseDir);

    if (subdirs.length === 0) {
      log(`No subdirectories found in "${baseDir}".`);
      return;
    }

    const results = await Promise.all(
      subdirs.map(async (dir) => ({
        dir,
        contents: await scanContents(resolve(baseDir, dir)),
      }))
    );

    allContentData = Object.fromEntries(
      results.map(({ dir, contents }) => [dir, contents])
    );

    const total = results.reduce((sum, r) => sum + r.contents.length, 0);
    log(`Scanned ${total} files in ${subdirs.length} subdirs.`);
  };

  return [
    mdx({
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: "frontmatter" }],
      ],
    }),
    {
      name: "vite-plugin-docs",

      async configResolved(config) {
        await loadContents(config.root);
      },

      resolveId(id) {
        return id === VIRTUAL_MODULE_ID ? RESOLVED_VIRTUAL_ID : null;
      },

      load(id) {
        if (id === RESOLVED_VIRTUAL_ID) {
          return generateContentsModule(allContentData);
        }
        return null;
      },

      async handleHotUpdate({ file, server }) {
        if (!file.includes(contentsDir)) {
          return;
        }

        await loadContents(server.config.root);

        return [RESOLVED_VIRTUAL_ID]
          .map((id) => server.moduleGraph.getModuleById(id))
          .filter((mod): mod is ModuleNode => Boolean(mod));
      },
    },
  ];
}
