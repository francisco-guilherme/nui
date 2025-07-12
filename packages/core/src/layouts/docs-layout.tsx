import type React from "react";
import { Footer, type FooterProps } from "../blocks/footer";
import { Header, type HeaderProps } from "../blocks/header";
import { Main, type MainProps } from "../blocks/main";
import { Sidebar, type SidebarProps } from "../blocks/sidebar";

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
