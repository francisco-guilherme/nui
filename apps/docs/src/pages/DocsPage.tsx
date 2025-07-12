import type React from "react";
import { Route, Routes, useParams } from "react-router-dom";

// Import MDX content dynamically
const DocsContent: React.FC = () => {
  const { "*": slug } = useParams();

  // For now, we'll show a placeholder based on the route
  const getContent = () => {
    switch (slug) {
      case "installation":
        return (
          <div>
            <h1 className="mb-6 font-bold text-3xl">Installation</h1>
            <p className="mb-4 text-lg">
              Installing dependencies and setting up the project.
            </p>
            <div className="prose max-w-none">
              <h2>Setup shadcn</h2>
              <p>
                Follow the{" "}
                <a
                  className="text-primary hover:underline"
                  href="https://ui.shadcn.com/docs/installation"
                >
                  shadcn installation guide
                </a>{" "}
                to setup your project.
              </p>

              <h2>Install Base UI</h2>
              <pre className="rounded-lg bg-muted p-4">
                <code>npm install @base-ui-components/react</code>
              </pre>

              <h2>Add Root class to your app layout</h2>
              <pre className="rounded-lg bg-muted p-4">
                <code>{`<body>
  <div className="Root">{children}</div>
</body>`}</code>
              </pre>
            </div>
          </div>
        );
      case "introduction":
        return (
          <div>
            <h1 className="mb-6 font-bold text-3xl">Introduction</h1>
            <p className="mb-4 text-lg">
              Beautiful, customizable components built with Base UI and Tailwind
              CSS
            </p>
            <div className="prose max-w-none">
              <p>
                This isn't a standard component library. It's a curated set of
                components that you can customize to fit your style.
              </p>
              <p>
                You won't install it through npm. Instead, you simply select the
                components you need and add them directly to your project.
              </p>
              <p>
                Once included, each component is fully adaptable, letting you
                fine-tune it to meet your exact requirements.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div>
            <h1 className="mb-6 font-bold text-3xl">Documentation</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Welcome to the NUI documentation. Choose a topic from the sidebar
              to get started.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <a
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                href="/docs/introduction"
              >
                <h3 className="mb-2 font-semibold">Introduction</h3>
                <p className="text-muted-foreground text-sm">
                  Learn about NUI and its philosophy
                </p>
              </a>
              <a
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                href="/docs/installation"
              >
                <h3 className="mb-2 font-semibold">Installation</h3>
                <p className="text-muted-foreground text-sm">
                  Get started with NUI in your project
                </p>
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">{getContent()}</div>
    </div>
  );
};

const DocsPage: React.FC = () => {
  return (
    <Routes>
      <Route element={<DocsContent />} path="/*" />
    </Routes>
  );
};

export default DocsPage;
