export interface HeaderProps {
  title?: string;
  description?: string;
  logo?: React.ReactNode;
  navigation?: Array<{
    title: string;
    href: string;
    active?: boolean;
  }>;
  actions?: React.ReactNode;
  className?: string;
}

export const Header = ({
  title,
  description,
  logo,
  navigation = [],
  actions,
  className = "",
}: HeaderProps) => {
  return (
    <header className={`border-b px-6 py-4 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {logo}
            <div>
              {title && <h1 className="font-bold text-2xl">{title}</h1>}
              {description && <p className="mt-1">{description}</p>}
            </div>
          </div>

          {navigation.length > 0 && (
            <nav className="hidden space-x-6 md:flex">
              {navigation.map((item) => (
                <a
                  className={`font-medium text-sm ${
                    item.active ? "text-blue-600" : "hover:text-blue-600"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          )}

          {actions && (
            <div className="flex items-center space-x-2">{actions}</div>
          )}
        </div>
      </div>
    </header>
  );
};
