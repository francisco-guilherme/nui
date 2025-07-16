import { contents } from "virtual:docs-contents";
import type { SidebarItem } from "@nui/core";

interface NavigationItem {
  title: string;
  href: string;
  active?: boolean;
  children?: NavigationItem[];
}

// Content is now provided by the plugin's virtual modules with directory grouping
type Content = (typeof contents)[keyof typeof contents][0];

// Extract directory-specific contents for streamlined navigation creation
const componentsContents = contents.components || [];
const docsContents = contents.docs || [];

/**
 * Sorts content items by title from frontmatter, falling back to name
 */
const sortByTitle = (a: Content, b: Content): number => {
  const titleA = (a.frontmatter.title as string) || a.name;
  const titleB = (b.frontmatter.title as string) || b.name;
  return titleA.localeCompare(titleB);
};

/**
 * Converts content metadata to navigation items
 */
const contentToNavItem = (content: Content): NavigationItem => ({
  title: (content.frontmatter.title as string) || content.name,
  href: content.path,
});

/**
 * Groups content by category based on frontmatter.category or path structure
 */
const groupContentByCategory = (
  contentList: Content[]
): Record<string, Content[]> => {
  return contentList.reduce(
    (groups, content) => {
      // Try to get category from frontmatter first
      let category = content.frontmatter.category as string;

      // If no category in frontmatter, derive from path
      if (!category) {
        const pathParts = content.path.split("/").filter(Boolean);
        if (pathParts.length > 1) {
          category = pathParts[0]; // e.g., "docs" or "components"
        } else {
          category = "general";
        }
      }

      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(content);
      return groups;
    },
    {} as Record<string, Content[]>
  );
};

/**
 * Generates navigation configuration using virtual docs contents
 */
export const generateNavigationConfig = (): SidebarItem[] => {
  const navigation: NavigationItem[] = [];

  // Process docs contents (from virtual:docs-demos)
  if (docsContents.length > 0) {
    const docsGroups = groupContentByCategory(docsContents);

    // Create "Getting Started" section for docs
    const gettingStartedDocs =
      docsGroups.docs
        ?.filter((doc) =>
          ["installation", "introduction", "getting-started"].includes(
            doc.name.toLowerCase()
          )
        )
        .sort(sortByTitle) || [];

    if (gettingStartedDocs.length > 0) {
      navigation.push({
        title: "Getting Started",
        href: "/docs",
        children: gettingStartedDocs.map(contentToNavItem),
      });
    }

    // Create "Theming" section for theme-related docs
    const themingDocs =
      docsGroups.docs
        ?.filter((doc) =>
          ["theming", "colors", "dark-mode", "theme-provider"].includes(
            doc.name.toLowerCase()
          )
        )
        .sort(sortByTitle) || [];

    if (themingDocs.length > 0) {
      navigation.push({
        title: "Theming",
        href: "/docs/theming",
        children: themingDocs.map(contentToNavItem),
      });
    }

    // Add any remaining docs that don't fit in specific categories
    const allCategorizedDocs = [...gettingStartedDocs, ...themingDocs];
    const remainingDocs =
      docsGroups.docs
        ?.filter((doc) => !allCategorizedDocs.includes(doc))
        .sort(sortByTitle) || [];

    if (remainingDocs.length > 0) {
      navigation.push({
        title: "Documentation",
        href: "/docs",
        children: remainingDocs.map(contentToNavItem),
      });
    }
  }

  // Process components contents (from virtual:docs-contents)
  if (componentsContents.length > 0) {
    const sortedComponents = [...componentsContents].sort(sortByTitle);

    navigation.push({
      title: "Components",
      href: "/components",
      active: true,
      children: sortedComponents.map(contentToNavItem),
    });
  }

  return navigation;
};

/**
 * Gets all component navigation items for use in component pages
 */
export const getComponentNavigation = (): NavigationItem[] => {
  return [...componentsContents].sort(sortByTitle).map(contentToNavItem);
};

/**
 * Gets all docs navigation items for use in docs pages
 */
export const getDocsNavigation = (): NavigationItem[] => {
  return [...docsContents].sort(sortByTitle).map(contentToNavItem);
};

/**
 * Finds content metadata by path
 */
export const findContentByPath = (path: string): Content | undefined => {
  return [...componentsContents, ...docsContents].find(
    (content) => content.path === path
  );
};

/**
 * Gets content metadata for a specific component
 */
export const getComponentContent = (
  componentName: string
): Content | undefined => {
  return componentsContents.find(
    (content) =>
      content.name === componentName ||
      content.path === `/components/${componentName}`
  );
};

/**
 * Gets content metadata for a specific docs page
 */
export const getDocsContent = (docName: string): Content | undefined => {
  return docsContents.find(
    (content) => content.name === docName || content.path === `/docs/${docName}`
  );
};

/**
 * Gets all available directories with their content counts
 */
export const getDirectorySummary = (): Record<string, number> => {
  return Object.fromEntries(
    Object.entries(contents).map(([dir, dirContents]) => [
      dir,
      dirContents.length,
    ])
  );
};

/**
 * Gets navigation items for a specific directory
 */
export const getDirectoryNavigation = (directory: string): NavigationItem[] => {
  const dirContents = contents[directory] || [];
  return [...dirContents].sort(sortByTitle).map(contentToNavItem);
};

/**
 * Creates a sidebar structure from directory contents with optional grouping
 */
export const createDirectorySidebar = (
  directory: string,
  options: {
    groupByCategory?: boolean;
    sortByTitle?: boolean;
    includeDescription?: boolean;
  } = {}
): SidebarItem[] => {
  const {
    groupByCategory = false,
    sortByTitle: shouldSort = true,
    includeDescription = false,
  } = options;
  const dirContents = contents[directory] || [];

  if (dirContents.length === 0) {
    return [];
  }

  let processedContents = [...dirContents];

  if (shouldSort) {
    processedContents = processedContents.sort(sortByTitle);
  }

  if (groupByCategory) {
    const grouped = groupContentByCategory(processedContents);
    return Object.entries(grouped).map(([category, categoryContents]) => ({
      title: category.charAt(0).toUpperCase() + category.slice(1),
      href: `/${directory}/${category}`,
      children: categoryContents.map((content) => ({
        title: (content.frontmatter.title as string) || content.name,
        href: content.path,
        ...(includeDescription &&
          content.frontmatter.description && {
            description: content.frontmatter.description as string,
          }),
      })),
    }));
  }

  return processedContents.map((content) => ({
    title: (content.frontmatter.title as string) || content.name,
    href: content.path,
    ...(includeDescription &&
      content.frontmatter.description && {
        description: content.frontmatter.description as string,
      }),
  }));
};

/**
 * Gets all available directories
 */
export const getAvailableDirectories = (): string[] => {
  return Object.keys(contents);
};
