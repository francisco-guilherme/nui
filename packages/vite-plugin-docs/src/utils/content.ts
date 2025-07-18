import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { relative, resolve } from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import { normalizePath } from "vite";

import type { Content, Contents } from "../types/content";

const EXT_REGEX = /\.(mdx|tsx)$/;

/** Convert relative path to route-safe path */
const toRoutePath = (relPath: string): string =>
  `/${relPath.replace(EXT_REGEX, "")}`.replace(/\/index$/, "") || "/";

/** Parse frontmatter from file */
const parseFile = (file: string, baseDir: string, rootDir: string): Content => {
  const raw = readFileSync(file, "utf-8");
  const { data } = matter(raw);
  
  const relName = normalizePath(relative(baseDir, file)).replace(EXT_REGEX, "");
  const relPath = normalizePath(relative(rootDir, file));

  return {
    name: relName,
    path: toRoutePath(relPath),
    file,
    frontmatter: data,
  };
};

/** Get .mdx/.tsx files in a directory */
const scanContents = async (
  dir: string,
  rootDir: string
): Promise<Content[]> => {
  const files = await fg("*.{mdx,tsx}", { cwd: dir, absolute: true });
  return files.map((file) => parseFile(file, dir, rootDir));
};

/** List subdirectories */
const getSubdirectories = async (dir: string): Promise<string[]> => {
  try {
    return (await readdir(dir, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch (err) {
    console.warn(`⚠️ Failed to read "${dir}"`, err);
    return [];
  }
};

/** Recursively build content tree */
const buildContentTree = async (
  dir: string,
  rootDir: string,
  relPath = ""
): Promise<Contents> => {
  const [files, dirs] = await Promise.all([
    scanContents(dir, rootDir),
    getSubdirectories(dir),
  ]);

  const subdirectories = Object.fromEntries(
    await Promise.all(
      dirs.map(async (d) => {
        const full = resolve(dir, d);
        const sub = relPath ? `${relPath}/${d}` : d;
        return [d, await buildContentTree(full, rootDir, sub)];
      })
    )
  );

  return {
    name: relPath.split("/").pop() || "root",
    path: relPath,
    contents: files,
    subdirectories,
  };
};

/** Load content structure from disk */
export const loadContents = async (
  root: string,
  dir: string
): Promise<Contents | null> => {
  try {
    const full = resolve(root, dir);
    return await buildContentTree(full, full);
  } catch (err) {
    console.error("❌ loadContents failed:", err);
    return null;
  }
};
