import type React from "react";
import { Route, Routes, useParams } from "react-router-dom";
import {
  getComponentContent,
  getComponentNavigation,
} from "../utils/navigation";

// Import MDX content dynamically
const ComponentsContent: React.FC = () => {
  const { "*": slug } = useParams();

  // Get content from virtual module
  const currentContent = slug ? getComponentContent(slug) : null;
  const allComponents = getComponentNavigation();

  const getContent = () => {
    if (!slug) {
      // Show components overview page
      return (
        <div>
          <h1 className="mb-6 font-bold text-3xl">Components</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Explore our collection of {allComponents.length} customizable
            components.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allComponents.map((component) => (
              <a
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                href={component.href}
                key={component.href}
              >
                <h3 className="mb-2 font-semibold">{component.title}</h3>
                <p className="text-muted-foreground text-sm">
                  Component documentation
                </p>
              </a>
            ))}
          </div>
        </div>
      );
    }

    if (currentContent) {
      // Show content from virtual module
      const { title, description } = currentContent.frontmatter;
      return (
        <div>
          <h1 className="mb-6 font-bold text-3xl">
            {(title as string) || currentContent.name}
          </h1>
          <p className="mb-4 text-lg">
            {(description as string) ||
              `Documentation for ${currentContent.name}`}
          </p>
          <div className="prose max-w-none">
            <p>
              Content loaded from: <code>{currentContent.file}</code>
            </p>
            <p>
              Route path: <code>{currentContent.path}</code>
            </p>
            {/* Here you would dynamically import and render the actual MDX content */}
          </div>
        </div>
      );
    }

    // Fallback for unknown routes
    return (
      <div>
        <h1 className="mb-6 font-bold text-3xl">Component Not Found</h1>
        <p className="mb-4 text-lg">The component "{slug}" was not found.</p>
        <a
          className="font-medium text-primary hover:underline"
          href="/components"
        >
          ← Back to Components
        </a>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">{getContent()}</div>
    </div>
  );
};

const ComponentsPage: React.FC = () => {
  return (
    <Routes>
      <Route element={<ComponentsContent />} path="/*" />
    </Routes>
  );
};

export default ComponentsPage;
