import {
  Footer,
  type FooterProps,
  Header,
  type HeaderProps,
  Main,
  type MainProps,
  Sidebar,
  type SidebarProps,
} from "@nui/core";

import type React from "react";

export interface DocsLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  header?: Partial<HeaderProps>;
  footer?: Partial<FooterProps>;
  main?: Partial<MainProps>;
  sidebar?: Partial<SidebarProps>;
}

export const DocsLayout = ({
  children,
  title,
  description,
  header = {},
  footer = {},
  main = {},
  sidebar = {},
}: DocsLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header description={description} title={title} {...header} />

      <div className="flex flex-1">
        <Sidebar {...sidebar} />

        <Main {...main}>{children}</Main>
      </div>

      <Footer {...footer} />
    </div>
  );
};
