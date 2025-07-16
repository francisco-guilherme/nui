import fs from "node:fs";
import { relative } from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import { normalizePath } from "vite";
import type { Content } from "../types/content";

const EXT_REGEX = /\.(mdx|tsx)$/;

/**
 * Normalize a file path to a clean route path.
 * - Removes file extensions
 * - Converts `index` routes to root
 * - Strips trailing slashes
 */
const toRoutePath = (relativePath: string): string => {
  let path = `/${relativePath.replace(EXT_REGEX, "")}`;
  path = path.replace(/\/index$/, "").replace(/\/$/, "");
  return path || "/";
};

/**
 * Parse a content file and return metadata.
 */
const parseContentFile = (filePath: string, baseDir: string): Content => {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter } = matter(raw);
  const relPath = normalizePath(relative(baseDir, filePath));

  return {
    name: relPath.replace(EXT_REGEX, ""),
    path: toRoutePath(relPath),
    file: filePath,
    frontmatter,
  };
};

/**
 * Scan directory recursively for .mdx/.tsx files and return parsed content metadata.
 */
export const scanContents = async (baseDir: string): Promise<Content[]> => {
  const files = await fg("**/*.{mdx,tsx}", {
    cwd: baseDir,
    absolute: true,
  });

  if (files.length === 0) {
    console.warn(`[scanContents] No content files found in: ${baseDir}`);
  }

  return files.map((file) => parseContentFile(file, baseDir));
};
