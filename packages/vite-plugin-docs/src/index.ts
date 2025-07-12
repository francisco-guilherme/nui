import { resolve } from "node:path";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import type { ModuleNode, Plugin } from "vite";

import type { ContentMetadata } from "./types/metadata";
import { scanContents } from "./utils/content";
import { generateContentsModule } from "./utils/modules";

/**
 * Virtual module mappings for docs plugin
 * Maps virtual import paths to their resolved identifiers
 */
const VIRTUAL_MODULES = new Map([
  ["virtual:docs-contents", "\0virtual:docs-contents"],
  ["virtual:docs-demos", "\0virtual:docs-demos"],
]);

/**
 * Configuration options for the docs plugin
 */
interface DocsPluginOptions {
  /** Directory containing content files (default: "content") */
  contentsDir?: string;
  /** Enable verbose logging (default: false) */
  verbose?: boolean;
}

/**
 * Vite plugin for processing documentation files and demos
 * Provides virtual modules for accessing scanned content metadata
 */
export default function docsPlugin(options: DocsPluginOptions = {}): Plugin[] {
  const { contentsDir = "content", verbose = true } = options;

  let componentsData: ContentMetadata[] = [];
  let docsData: ContentMetadata[] = [];

  /**
   * Loads and scans content and demo files from configured directories
   */
  const loadData = async (root: string) => {
    try {
      const baseDir = resolve(root, contentsDir);

      // Load local content
      [componentsData, docsData] = await Promise.all([
        scanContents(resolve(baseDir, "components")),
        scanContents(resolve(baseDir, "docs")),
      ]);

      if (verbose) {
        // biome-ignore lint: debug logging
        console.log(
          `Scanned docs: ${componentsData.length}, demos: ${docsData.length}`
        );
      }
    } catch (_error) {
      componentsData = [];
      docsData = [];
    }
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
        await loadData(config.root);
      },

      resolveId(id) {
        return VIRTUAL_MODULES.get(id) ?? null;
      },

      load(id) {
        if (id === "virtual:docs-contents") {
          return generateContentsModule(componentsData);
        }
        if (id === "virtual:docs-demos") {
          return generateContentsModule(docsData);
        }
        return null;
      },

      async handleHotUpdate({ file, server }) {
        if (!file.includes(contentsDir)) {
          return;
        }

        await loadData(server.config.root);

        return Array.from(VIRTUAL_MODULES.values())
          .map((id) => server.moduleGraph.getModuleById(id))
          .filter((mod): mod is ModuleNode => Boolean(mod));
      },
    },
  ];
}
