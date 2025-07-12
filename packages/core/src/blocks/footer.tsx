export interface FooterProps {
  copyright?: string;
  links?: Array<{
    title: string;
    href: string;
  }>;
  social?: Array<{
    name: string;
    href: string;
    icon?: React.ReactNode;
  }>;
  content?: React.ReactNode;
  className?: string;
}

export const Footer = ({
  copyright = "Powered by NUI Docs",
  links = [],
  social = [],
  content,
  className = "",
}: FooterProps) => {
  return (
    <footer className={`border-t px-6 py-4 ${className}`}>
      <div className="mx-auto max-w-7xl">
        {content ? (
          content
        ) : (
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="text-center md:text-left">
              <p>{copyright}</p>
            </div>

            {(links.length > 0 || social.length > 0) && (
              <div className="flex flex-col items-center space-y-2 md:flex-row md:space-x-6 md:space-y-0">
                {links.length > 0 && (
                  <div className="flex space-x-4">
                    {links.map((link) => (
                      <a
                        className="text-sm hover:text-blue-600"
                        href={link.href}
                        key={link.href || link.title}
                      >
                        {link.title}
                      </a>
                    ))}
                  </div>
                )}

                {social.length > 0 && (
                  <div className="flex space-x-3">
                    {social.map((item) => (
                      <a
                        aria-label={item.name}
                        className="hover:text-blue-600"
                        href={item.href}
                        key={item.href || item.name}
                      >
                        {item.icon || item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
};
