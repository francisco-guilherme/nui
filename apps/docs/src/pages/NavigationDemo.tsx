import type React from "react";
import {
  findContentByPath,
  generateNavigationConfig,
  getComponentNavigation,
  getDocsNavigation,
} from "../utils/navigation";

const NavigationDemo: React.FC = () => {
  // Get all navigation data
  const fullNavigation = generateNavigationConfig();
  const componentNavigation = getComponentNavigation();
  const docsNavigation = getDocsNavigation();

  // Example of finding specific content
  const buttonContent = findContentByPath("/components/button");
  const installationContent = findContentByPath("/docs/installation");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="mb-6 font-bold text-3xl">
            Navigation Generation Demo
          </h1>
          <p className="mb-4 text-lg text-muted-foreground">
            This page demonstrates how to use the virtual:docs-contents system
            for dynamic navigation generation.
          </p>
        </div>

        {/* Full Navigation Structure */}
        <div>
          <h2 className="mb-4 font-semibold text-2xl">
            Full Navigation Structure
          </h2>
          <div className="rounded-lg border p-4">
            <pre className="text-sm">
              {JSON.stringify(fullNavigation, null, 2)}
            </pre>
          </div>
        </div>

        {/* Components Navigation */}
        <div>
          <h2 className="mb-4 font-semibold text-2xl">
            Components ({componentNavigation.length} items)
          </h2>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {componentNavigation.map((item) => (
              <a
                className="rounded border p-3 text-sm hover:bg-muted/50"
                href={item.href}
                key={item.href}
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>

        {/* Docs Navigation */}
        <div>
          <h2 className="mb-4 font-semibold text-2xl">
            Documentation ({docsNavigation.length} items)
          </h2>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {docsNavigation.map((item) => (
              <a
                className="rounded border p-3 text-sm hover:bg-muted/50"
                href={item.href}
                key={item.href}
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>

        {/* Content Lookup Examples */}
        <div>
          <h2 className="mb-4 font-semibold text-2xl">
            Content Lookup Examples
          </h2>
          <div className="space-y-4">
            {buttonContent && (
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Button Component</h3>
                <p className="mb-2 text-muted-foreground text-sm">
                  {buttonContent.frontmatter.description as string}
                </p>
                <p className="text-muted-foreground text-xs">
                  File: {buttonContent.file}
                </p>
              </div>
            )}

            {installationContent && (
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Installation Guide</h3>
                <p className="mb-2 text-muted-foreground text-sm">
                  {installationContent.frontmatter.description as string}
                </p>
                <p className="text-muted-foreground text-xs">
                  File: {installationContent.file}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Usage Examples */}
        <div>
          <h2 className="mb-4 font-semibold text-2xl">Usage Examples</h2>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-medium">Import Virtual Modules</h3>
              <pre className="rounded bg-muted p-3 text-sm">
                {`import { contents as componentsContents } from "virtual:docs-contents";
import { contents as docsContents } from "virtual:docs-demos";`}
              </pre>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-medium">Generate Navigation</h3>
              <pre className="rounded bg-muted p-3 text-sm">
                {`import { generateNavigationConfig } from "../utils/navigation";

const navigation = generateNavigationConfig();
// Use in your layout configuration`}
              </pre>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-medium">Find Content by Path</h3>
              <pre className="rounded bg-muted p-3 text-sm">
                {`import { findContentByPath } from "../utils/navigation";

const content = findContentByPath("/components/button");
if (content) {
  const { title, description } = content.frontmatter;
  // Render content...
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationDemo;
