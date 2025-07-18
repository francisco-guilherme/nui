import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import type { Plugin } from "vite";

import type { Contents } from "./types/content";
import { loadContents } from "./utils/content";
import { generateContentsModule } from "./utils/modules";

const VIRTUAL_MODULE_ID = "virtual:docs-contents";
const RESOLVED_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

export interface DocsPluginOptions {
  contentsDir?: string;
  verbose?: boolean;
}

export default function docsPlugin({
  contentsDir = "content",
  verbose = false,
}: DocsPluginOptions = {}): Plugin[] {
  let contents: Contents | null = null;

  const reloadContents = async (root: string) => {
    try {
      contents = await loadContents(root, contentsDir);

      if (verbose) {
        console.log(`[docs-plugin] Loaded content from ${contentsDir}`);
      }
    } catch (error) {
      console.error("[docs-plugin] Failed to load content:", error);
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
        await reloadContents(config.root);
      },

      resolveId(id) {
        return id === VIRTUAL_MODULE_ID ? RESOLVED_MODULE_ID : null;
      },

      load(id) {
        return id === RESOLVED_MODULE_ID
          ? generateContentsModule(contents)
          : null;
      },

      async handleHotUpdate({ file, server }) {
        if (!file.includes(contentsDir)) {
          return;
        }

        await reloadContents(server.config.root);

        const module = server.moduleGraph.getModuleById(RESOLVED_MODULE_ID);
        return module ? [module] : [];
      },
    },
  ];
}
