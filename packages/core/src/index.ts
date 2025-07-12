// Blocks
export { Footer, type FooterProps } from "./blocks/footer";
export { Header, type HeaderProps } from "./blocks/header";
export { Main, type MainProps } from "./blocks/main";
export {
  Sidebar,
  type SidebarItem,
  type SidebarProps,
} from "./blocks/sidebar";

// Layouts
export {
  DocsLayout,
  type DocsLayoutProps,
} from "./layouts/docs-layout";

// Providers
export { ThemeProvider, useTheme } from "./providers/theme";

// Theme
export { ThemeToggle, type ThemeToggleProps } from "./theme/toggle";

// UI Components
export * from "./ui";

// Utils
export { cn } from "./utils/cn";
