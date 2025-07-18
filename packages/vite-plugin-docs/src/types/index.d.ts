import type { DocNavItem } from "../utils/modules";
import type { Contents } from "./content";

declare module "virtual:docs-contents" {
  export const contents: Contents | null;
  export const navigation: DocNavItem[];
}
