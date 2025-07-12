import type { ContentMetadata } from "./metadata";

declare module "virtual:docs-contents" {
  export const contents: ContentMetadata[];
}

declare module "virtual:docs-demos" {
  export const contents: ContentMetadata[];
}

declare module "virtual:docs-layout" {
  export { DocsLayout, type DocsLayoutProps } from "../components/docs-layout";
}
