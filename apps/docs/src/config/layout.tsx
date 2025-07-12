import { Button, ThemeToggle } from "@nui/core";

export const layoutConfig = {
  title: "NUI Documentation",
  description:
    "A modern React component library built with TypeScript and Tailwind CSS",
  header: {
    navigation: [
      { title: "Docs", href: "/docs", active: true },
      { title: "Components", href: "/components" },
      { title: "Examples", href: "/examples" },
      { title: "GitHub", href: "https://github.com" },
    ],
    actions: (
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Button size="sm" variant="outline">
          View on GitHub
        </Button>
      </div>
    ),
  },
  sidebar: {
    navigation: [
      {
        title: "Getting Started",
        href: "/docs",
        children: [
          { title: "Installation", href: "/docs/installation" },
          { title: "Introduction", href: "/docs/introduction" },
        ],
      },
      {
        title: "Components",
        href: "/components",
        active: true,
        children: [
          { title: "Button", href: "/components/button" },
          { title: "Card", href: "/components/card" },
          { title: "Input", href: "/components/input" },
          { title: "Badge", href: "/components/badge" },
        ],
      },
      {
        title: "Theming",
        href: "/docs/theming",
        children: [
          { title: "Colors", href: "/docs/colors" },
          { title: "Dark Mode", href: "/docs/dark-mode" },
        ],
      },
    ],
  },
};
