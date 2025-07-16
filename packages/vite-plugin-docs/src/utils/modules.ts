import type { Content } from "../types/content";

/**
 * Creates an import statement for a file.
 */
const createImport = (id: number, file: string) =>
  `import Page${id} from ${JSON.stringify(file)};`;

/**
 * Creates a unified contents module with all directories
 */
export const generateContentsModule = (
  allContentData: Record<string, Content[]>
): string => {
  const allContents = Object.values(allContentData).flat();

  if (allContents.length === 0) {
    return `import React from "react";
export const contents = [];`;
  }

  const imports = allContents.map((c, i) => createImport(i, c.file)).join("\n");

  const contentExports = allContents
    .map((c, i) => {
      const path = JSON.stringify(c.path);
      const meta = JSON.stringify(c.frontmatter || {});
      return `  { path: ${path}, element: Page${i}, meta: ${meta} }`;
    })
    .join(",\n");

  return `import React from "react";

${imports}

export const contents = [
${contentExports}
];
`;
};
