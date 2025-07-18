import type { Content, Contents, NavItem } from "../types/content";

const titleTransform = (name: string): string =>
  name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

/**
 * Convert content to a navigation item
 */
const createNavItem = (content: Content): NavItem => {
  const { title, description } = content.frontmatter;

  return {
    title:
      typeof title === "string" && title.trim()
        ? title.trim()
        : titleTransform(content.name),

    description:
      typeof description === "string" && description.trim()
        ? description.trim()
        : undefined,

    href: content.path,
  };
};

/**
 * Recursively build the navigation structure from contents
 */
const buildNavigation = (node: Contents): NavItem[] => {
  const items: NavItem[] = [];

  // Convert current directory contents
  const contentItems = node.contents.map(createNavItem);
  items.push(...contentItems);

  // Recursively process subdirectories
  for (const [name, subnode] of Object.entries(node.subdirectories)) {
    const children = buildNavigation(subnode);

    if (children.length > 0) {
      items.push({
        title: titleTransform(name),
        href: subnode.path || `/${name}`,
        children,
      });
    }
  }

  return items;
};

/**
 * Generate a TypeScript module exporting the contents and navigation
 */
export const generateContentsModule = (contents: Contents | null): string => {
  const navigation = contents ? buildNavigation(contents) : [];

  return `export const contents = ${JSON.stringify(contents, null, 2)};
export const navigation = ${JSON.stringify(navigation, null, 2)};`;
};
