import type { ContentMetadata } from "../types/metadata";

export const generateContentsModule = (contents: ContentMetadata[]) => {
  return `export const contents = ${JSON.stringify(contents)};`;
};
