import { contents } from "virtual:docs-contents";
import { type LazyExoticComponent, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { MDXProvider } from "./mdx-provider";

type ContentEntry = { path: string; file: string };
type ContentNode = {
  contents?: ContentEntry[];
  subdirectories?: Record<string, ContentNode>;
};

const componentCache = new Map<
  string,
  LazyExoticComponent<React.ComponentType>
>();

const normalizeImportPath = (filePath: string): string => {
  const i = filePath.indexOf("/content/");
  const trimmed = i !== -1 ? filePath.slice(i + 1) : filePath;
  return trimmed.startsWith("../../content/") ? trimmed : `../../${trimmed}`;
};

const createMDXComponent = (
  filePath: string
): LazyExoticComponent<React.ComponentType> => {
  if (!componentCache.has(filePath)) {
    const importPath = normalizeImportPath(filePath);

    const Component = lazy(() =>
      import(/* @vite-ignore */ importPath).catch((err) => {
        console.error(`❌ Failed to import ${importPath}`, err);
        return { default: () => <p>Error loading content.</p> };
      })
    );

    componentCache.set(filePath, Component);
  }

  const Component = componentCache.get(filePath);
  if (!Component) {
    throw new Error(`Component for "${filePath}" not found in cache.`);
  }

  return Component;
};

const collectAllContent = (node: ContentNode): ContentEntry[] => [
  ...(node.contents ?? []),
  ...Object.values(node.subdirectories ?? {}).flatMap(collectAllContent),
];

const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="container mx-auto px-4 py-8">
    <div className="mx-auto max-w-4xl">{children}</div>
  </div>
);

const MDXContentRenderer = ({ filePath }: { filePath: string }) => {
  const { pathname } = useLocation();
  const Component = createMDXComponent(filePath);

  return (
    <PageLayout>
      <MDXProvider>
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                Loading content for {pathname}...
              </div>
            }
          >
            <Component />
          </Suspense>
        </article>
      </MDXProvider>
    </PageLayout>
  );
};

const DocsRouter = () => {
  const allContent = collectAllContent(contents);

  return (
    <Routes>
      {/* Test Route */}
      <Route
        element={
          <PageLayout>
            <h1 className="mb-6 font-bold text-3xl">Test Route</h1>
            <p>This is a test route to verify routing is working.</p>
            <p>Total content items found: {allContent.length}</p>
            <ul className="mt-4 list-disc pl-5">
              {allContent.slice(0, 5).map(({ path, file }) => (
                <li key={path}>
                  <code>{path}</code> → <code>{file}</code>
                </li>
              ))}
            </ul>
          </PageLayout>
        }
        path="/test"
      />

      {/* Dynamic MDX Routes */}
      {allContent.map(({ path, file }) => (
        <Route
          element={<MDXContentRenderer filePath={file} />}
          key={path}
          path={path}
        />
      ))}

      {/* 404 Catch-All */}
      <Route
        element={
          <PageLayout>
            <h1 className="mb-6 font-bold text-3xl">Page Not Found</h1>
            <p className="mb-4 text-lg">The requested page was not found.</p>
            <a className="font-medium text-primary hover:underline" href="/">
              ← Back to Home
            </a>
          </PageLayout>
        }
        path="*"
      />
    </Routes>
  );
};

export default DocsRouter;
