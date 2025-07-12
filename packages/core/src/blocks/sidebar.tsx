export interface SidebarItem {
  title: string;
  href: string;
  active?: boolean;
  children?: SidebarItem[];
}

export interface SidebarProps {
  navigation?: SidebarItem[];
  title?: string;
  width?: "sm" | "md" | "lg";
  position?: "left" | "right";
  className?: string;
  children?: React.ReactNode;
}

export const Sidebar = ({
  navigation = [],
  title,
  width = "md",
  position = "left",
  className = "",
  children,
}: SidebarProps) => {
  const widthClasses = {
    sm: "w-48",
    md: "w-64",
    lg: "w-80",
  };

  const renderNavItem = (item: SidebarItem, depth = 0) => (
    <div className={depth > 0 ? "ml-4" : ""} key={item.href}>
      <a
        className={`block rounded px-3 py-2 text-sm ${
          item.active
            ? "bg-blue-50 font-medium text-blue-700"
            : "hover:bg-gray-50 hover:text-gray-900"
        }`}
        href={item.href}
      >
        {item.title}
      </a>
      {item.children && (
        <div className="mt-1 space-y-1">
          {item.children.map((child) => renderNavItem(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <aside
      className={`${widthClasses[width]} ${position === "right" ? "order-last" : ""} ${className}`}
    >
      <div className="sticky top-0 h-screen overflow-y-auto p-6">
        {title && <h2 className="mb-4 font-semibold text-lg">{title}</h2>}

        {children ? (
          children
        ) : (
          <nav className="space-y-1">
            {navigation.map((item) => renderNavItem(item))}
          </nav>
        )}
      </div>
    </aside>
  );
};
