interface Content {
  name: string;
  path: string;
  file: string;
  frontmatter: Record<string, unknown>;
}

declare module "virtual:docs-contents" {
  export const contents: Record<string, Content[]>;
}
