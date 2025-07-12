import fs from "node:fs";
import { relative } from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import { normalizePath } from "vite";

import type { ContentMetadata } from "../types/metadata";

const EXT_REGEX = /\.(mdx|tsx)$/;
const INDEX_REGEX = /\/index$/;
const TRAILING_SLASH_REGEX = /\/$/;

/**
 * Converts a file path like "docs/getting-started.mdx" to "/docs/getting-started"
 * Special cases: "index.mdx" becomes "/" and trailing slashes are removed
 */
const createRoutePath = (relativePath: string): string => {
  const route = `/${relativePath.replace(EXT_REGEX, "").replace(INDEX_REGEX, "")}`;
  return route === "/" ? "/" : route.replace(TRAILING_SLASH_REGEX, "");
};

/**
 * Processes a single file to extract metadata and create content object
 */
const processFiles = (
  filePath: string,
  baseDirectory: string
): ContentMetadata => {
  // Read the file content
  const fileContent = fs.readFileSync(filePath, "utf-8");

  // Extract frontmatter using gray-matter
  const { data: frontmatter } = matter(fileContent);

  // Get relative path from base directory
  const relativePath = normalizePath(relative(baseDirectory, filePath));

  return {
    name: relativePath.replace(".mdx", ""),
    path: createRoutePath(relativePath),
    file: filePath,
    frontmatter,
  };
};

/**
 * Scans a directory for content files and extracts their metadata
 */
export const scanContents = async (
  contentsDir: string
): Promise<ContentMetadata[]> => {
  const files = await fg("**/*.{mdx,tsx}", {
    cwd: contentsDir,
    absolute: true,
  });

  if (files.length === 0) {
    // biome-ignore lint: debug logging
    console.warn(`No files found in ${contentsDir}`);
  }

  return files.map((file) => processFiles(file, contentsDir));
};
