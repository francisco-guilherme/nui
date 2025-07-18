import { cn } from "@nui/core";
import { Link, useLocation } from "react-router-dom";
import type { NavigationItem } from "../types/navigation";

interface HeaderNavigationProps {
  navigation: NavigationItem[];
  className?: string;
  onSectionChange?: (section: string) => void;
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  navigation,
  className,
  onSectionChange,
}) => {
  const { pathname } = useLocation();

  const rootSections = navigation.filter((item) => item.children?.length);

  const activeSection =
    rootSections
      .find((section) => {
        const key = section.title.toLowerCase();
        return (
          pathname.startsWith(`/${key}`) ||
          section.children?.some(
            (child) =>
              pathname === child.href || pathname.startsWith(`${child.href}/`)
          )
        );
      })
      ?.title.toLowerCase() ||
    rootSections[0]?.title.toLowerCase() ||
    "";

  return (
    <nav className={cn("flex items-center space-x-6", className)}>
      {rootSections.map((section) => {
        const key = section.title.toLowerCase();
        const isActive = key === activeSection;
        const href = section.children?.[0]?.href || `/${key}`;

        return (
          <Link
            className={cn(
              "font-medium text-sm transition-colors",
              isActive
                ? "text-foreground"
                : "text-foreground/60 hover:text-foreground/80"
            )}
            key={key}
            onClick={() => onSectionChange?.(key)}
            to={href}
          >
            {section.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default HeaderNavigation;
