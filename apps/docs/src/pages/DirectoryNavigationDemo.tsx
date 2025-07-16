import type React from "react";
import {
  getDirectorySummary,
  getDirectoryNavigation,
  createDirectorySidebar,
  getAvailableDirectories,
} from "../utils/navigation";
import { contents } from "virtual:docs-contents";

const DirectoryNavigationDemo: React.FC = () => {
  // Get directory summary
  const directorySummary = getDirectorySummary();
  const availableDirectories = getAvailableDirectories();

  // Get navigation for each directory
  const componentsNav = getDirectoryNavigation("components");
  const docsNav = getDirectoryNavigation("docs");

  // Create different sidebar configurations
  const componentsSidebar = createDirectorySidebar("components", {
    sortByTitle: true,
    includeDescription: true,
  });

  const docsSidebarGrouped = createDirectorySidebar("docs", {
    groupByCategory: true,
    sortByTitle: true,
    includeDescription: true,
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="mb-6 font-bold text-3xl">
          Directory-Grouped Navigation Demo
        </h1>
        <p className="mb-4 text-lg text-muted-foreground">
          Showcasing streamlined sidebar and navigation creation using directory-grouped content structure.
        </p>
      </div>

      {/* Directory Summary */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 font-semibold text-2xl">Directory Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(directorySummary).map(([dir, count]) => (
            <div key={dir} className="rounded-lg border p-4 bg-muted/50">
              <h3 className="font-medium text-lg capitalize">{dir}</h3>
              <p className="text-sm text-muted-foreground">{count} files</p>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Directory Contents */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 font-semibold text-2xl">Raw Directory Contents</h2>
        <div className="space-y-4">
          {availableDirectories.map((dir) => (
            <div key={dir} className="rounded border p-4">
              <h3 className="mb-2 font-medium capitalize">{dir} Directory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {contents[dir]?.slice(0, 6).map((content) => (
                  <div key={content.path} className="text-sm p-2 bg-muted/30 rounded">
                    <div className="font-medium">
                      {(content.frontmatter.title as string) || content.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {content.path}
                    </div>
                  </div>
                ))}
                {contents[dir]?.length > 6 && (
                  <div className="text-sm p-2 text-muted-foreground">
                    ... and {contents[dir].length - 6} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Components Navigation */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold text-xl">Components Navigation</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {componentsNav.slice(0, 10).map((item) => (
              <div key={item.href} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                <span className="text-sm">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.href}</span>
              </div>
            ))}
            {componentsNav.length > 10 && (
              <div className="text-sm text-muted-foreground p-2">
                ... and {componentsNav.length - 10} more components
              </div>
            )}
          </div>
        </div>

        {/* Docs Navigation */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold text-xl">Docs Navigation</h2>
          <div className="space-y-2">
            {docsNav.map((item) => (
              <div key={item.href} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                <span className="text-sm">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.href}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Components Sidebar */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold text-xl">Components Sidebar Structure</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {componentsSidebar.slice(0, 8).map((item) => (
              <div key={item.href} className="p-2 rounded bg-muted/30">
                <div className="font-medium text-sm">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.href}</div>
              </div>
            ))}
            {componentsSidebar.length > 8 && (
              <div className="text-sm text-muted-foreground p-2">
                ... and {componentsSidebar.length - 8} more items
              </div>
            )}
          </div>
        </div>

        {/* Docs Sidebar with Grouping */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 font-semibold text-xl">Docs Sidebar (Grouped)</h2>
          <div className="space-y-3">
            {docsSidebarGrouped.map((group) => (
              <div key={group.href} className="p-3 rounded bg-muted/30">
                <div className="font-medium text-sm mb-2">{group.title}</div>
                {group.children && (
                  <div className="space-y-1 ml-3">
                    {group.children.map((child) => (
                      <div key={child.href} className="text-xs p-1 rounded bg-background/50">
                        {child.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 font-semibold text-2xl">Usage Examples</h2>
        <div className="space-y-4">
          <div className="rounded border p-4">
            <h3 className="mb-2 font-medium">Import Directory-Grouped Contents</h3>
            <pre className="rounded bg-muted p-3 text-sm overflow-x-auto">
{`import { contents, contentsByDirectory } from "virtual:docs-contents";

// Access specific directory contents
const componentsContents = contents.components || [];
const docsContents = contents.docs || [];

// Or use the alias
const componentsContents = contentsByDirectory.components || [];`}
            </pre>
          </div>

          <div className="rounded border p-4">
            <h3 className="mb-2 font-medium">Create Streamlined Navigation</h3>
            <pre className="rounded bg-muted p-3 text-sm overflow-x-auto">
{`import { 
  getDirectoryNavigation, 
  createDirectorySidebar,
  getDirectorySummary 
} from "../utils/navigation";

// Get navigation for a specific directory
const componentsNav = getDirectoryNavigation("components");

// Create a sidebar with grouping and descriptions
const sidebar = createDirectorySidebar("docs", {
  groupByCategory: true,
  sortByTitle: true,
  includeDescription: true,
});

// Get summary of all directories
const summary = getDirectorySummary();`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryNavigationDemo;
