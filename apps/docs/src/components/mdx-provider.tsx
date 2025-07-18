import { MDXProvider as BaseMDXProvider } from "@mdx-js/react";
import type React from "react";
import { Icons, LinkCard, Preview, Step, Steps } from "./mdx";

// Define the components that will be available in MDX files
const mdxComponents = {
  // Custom components
  Steps,
  Step,
  Preview,
  Icons,
  LinkCard,

  // Override default HTML elements with styled versions
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mb-6 font-bold text-3xl tracking-tight" {...props}>
      {children}
    </h1>
  ),

  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-8 mb-4 font-semibold text-2xl tracking-tight" {...props}>
      {children}
    </h2>
  ),

  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-6 mb-3 font-semibold text-xl tracking-tight" {...props}>
      {children}
    </h3>
  ),

  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mt-4 mb-2 font-semibold text-lg tracking-tight" {...props}>
      {children}
    </h4>
  ),

  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 leading-7" {...props}>
      {children}
    </p>
  ),

  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-4 ml-6 list-disc space-y-2" {...props}>
      {children}
    </ul>
  ),

  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2" {...props}>
      {children}
    </ol>
  ),

  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),

  a: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      href={href}
      {...props}
    >
      {children}
    </a>
  ),

  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold text-sm"
      {...props}
    >
      {children}
    </code>
  ),

  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="mb-4 overflow-x-auto rounded-lg border bg-muted p-4"
      {...props}
    >
      {children}
    </pre>
  ),

  blockquote: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mb-4 border-primary border-l-4 pl-4 text-muted-foreground italic"
      {...props}
    >
      {children}
    </blockquote>
  ),

  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-border" {...props} />
  ),

  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse border border-border" {...props}>
        {children}
      </table>
    </div>
  ),

  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-border bg-muted px-4 py-2 text-left font-semibold"
      {...props}
    >
      {children}
    </th>
  ),

  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-border px-4 py-2" {...props}>
      {children}
    </td>
  ),
};

interface MDXProviderProps {
  children: React.ReactNode;
}

export const MDXProvider: React.FC<MDXProviderProps> = ({ children }) => {
  return (
    <BaseMDXProvider
      components={
        mdxComponents as unknown as React.ComponentProps<
          typeof BaseMDXProvider
        >["components"]
      }
    >
      {children}
    </BaseMDXProvider>
  );
};
