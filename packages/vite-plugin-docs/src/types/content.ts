export interface Content {
  name: string;
  path: string;
  file: string;
  frontmatter: Record<string, unknown>;
}

export interface Contents {
  name: string;
  path: string;
  contents: Content[];
  subdirectories: Record<string, Contents>;
}

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  children?: NavItem[];
}
