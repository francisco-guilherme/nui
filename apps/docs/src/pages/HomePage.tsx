import type React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 font-bold text-4xl">
          Welcome to NUI Documentation
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          A modern React component library built with TypeScript and Tailwind
          CSS
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h2 className="mb-3 font-semibold text-xl">Getting Started</h2>
            <p className="mb-4 text-muted-foreground">
              Learn how to install and set up NUI in your project.
            </p>
            <a
              className="font-medium text-primary hover:underline"
              href="/docs/installation"
            >
              View Installation Guide →
            </a>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-3 font-semibold text-xl">Components</h2>
            <p className="mb-4 text-muted-foreground">
              Explore our collection of customizable components.
            </p>
            <a
              className="font-medium text-primary hover:underline"
              href="/components"
            >
              Browse Components →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
