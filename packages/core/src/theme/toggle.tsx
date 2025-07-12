import clsx from "clsx";
import { useTheme } from "../providers/theme";
import { Button } from "../ui/button";

type Theme = "light" | "dark" | "system";

export interface ThemeToggleProps {
  /** Current theme value */
  theme?: Theme;
  /** Callback when theme changes */
  onThemeChange?: (theme: Theme) => void;
  /** Size variant of the toggle */
  size?: "sm" | "md" | "lg";
  /** Whether to show labels */
  showLabels?: boolean;
  /** Custom class name */
  className?: string;
}

const LightIcon = (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <title>Light</title>
    <path
      clipRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      fillRule="evenodd"
    />
  </svg>
);

const DarkIcon = (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <title>Dark</title>
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

export const ThemeToggle = ({
  size = "md",
  showLabels = false,
  className,
}: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const icon = isDark ? LightIcon : DarkIcon;

  if (showLabels) {
    return (
      <div className={clsx("flex items-center gap-2", className)}>
        <span className="font-medium text-foreground text-sm">Light</span>
        <Button
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
          onClick={toggleTheme}
          size={size}
          variant="outline"
        >
          {icon}
        </Button>
        <span className="font-medium text-foreground text-sm">Dark</span>
      </div>
    );
  }

  return (
    <Button
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={clsx("h-9 w-9 p-0", className)}
      onClick={toggleTheme}
      size={size}
      variant="ghost"
    >
      {icon}
    </Button>
  );
};
