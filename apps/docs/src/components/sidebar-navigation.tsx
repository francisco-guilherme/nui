import { cn } from "@nui/core";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileTextIcon,
  FolderIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { NavigationItem } from "../types/navigation";

interface SidebarNavigationProps {
  navigation: NavigationItem[];
  className?: string;
  activeSection?: string;
}

const containsActive = (item: NavigationItem, href: string): boolean =>
  item.href === href ||
  (item.children?.some((child) => containsActive(child, href)) ?? false);

const indentPx = (level: number) => `${8 + level * 16}px`;

const TreeNode: React.FC<{
  item: NavigationItem;
  level: number;
  activeHref: string;
}> = ({ item, level, activeHref }) => {
  const isActive = item.href === activeHref;
  const hasChildren = !!item.children?.length;
  const [expanded, setExpanded] = useState(() =>
    containsActive(item, activeHref)
  );

  useEffect(() => {
    if (containsActive(item, activeHref)) {
      setExpanded(true);
    }
  }, [activeHref, item]);

  const toggle = () => setExpanded((prev) => !prev);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  const indentStyle = { paddingLeft: indentPx(level) };

  return (
    <div className="select-none">
      {hasChildren ? (
        <button
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse section" : "Expand section"}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
            "cursor-pointer hover:bg-accent hover:text-accent-foreground",
            isActive && "bg-accent font-medium text-accent-foreground"
          )}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          style={indentStyle}
          tabIndex={0}
          type="button"
        >
          <span
            className="flex h-4 w-4 items-center justify-center rounded-sm hover:bg-accent-foreground/10"
            style={{ pointerEvents: "none" }}
          >
            {expanded ? (
              <ChevronDownIcon className="h-3 w-3" />
            ) : (
              <ChevronRightIcon className="h-3 w-3" />
            )}
          </span>
          <FolderIcon className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 truncate font-medium">{item.title}</span>
        </button>
      ) : (
        <Link
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:underline",
            isActive && "bg-accent font-medium text-accent-foreground"
          )}
          style={indentStyle}
          to={item.href}
        >
          <FileTextIcon className="h-3 w-3 text-muted-foreground" />
          <span className="flex-1 truncate">{item.title}</span>
        </Link>
      )}

      {hasChildren && expanded && item.children && (
        <div className="mt-1">
          {item.children.map((child) => (
            <TreeNode
              activeHref={activeHref}
              item={child}
              key={child.href}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  navigation,
  className,
  activeSection,
}) => {
  const { pathname } = useLocation();

  const section = activeSection
    ? navigation.find(
        (item) => item.title.toLowerCase() === activeSection.toLowerCase()
      )
    : undefined;

  const items = section?.children ?? navigation;
  const heading = activeSection
    ? activeSection.charAt(0).toUpperCase() + activeSection.slice(1)
    : "Documentation";

  return (
    <div className={cn("w-full", className)}>
      <div className="space-y-1">
        <div className="px-2 py-1.5">
          <h2 className="font-semibold text-lg tracking-tight">{heading}</h2>
        </div>
        <nav className="space-y-1">
          {items.map((item) => (
            <TreeNode
              activeHref={pathname}
              item={item}
              key={item.href}
              level={0}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SidebarNavigation;
