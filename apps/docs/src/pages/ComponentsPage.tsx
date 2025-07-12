import type React from "react";
import { Route, Routes, useParams } from "react-router-dom";

// Import MDX content dynamically
const ComponentsContent: React.FC = () => {
  const { "*": slug } = useParams();

  // For now, we'll show a placeholder based on the route
  const getContent = () => {
    switch (slug) {
      case "button":
        return (
          <div>
            <h1 className="mb-6 font-bold text-3xl">Button</h1>
            <p className="mb-4 text-lg">
              A customizable button component with multiple variants.
            </p>
            <div className="prose max-w-none">
              <h2>Usage</h2>
              <pre className="rounded-lg bg-muted p-4">
                <code>{`import { Button } from "@nui/core";

<Button variant="default">Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>`}</code>
              </pre>
            </div>
          </div>
        );
      case "card":
        return (
          <div>
            <h1 className="mb-6 font-bold text-3xl">Card</h1>
            <p className="mb-4 text-lg">
              A flexible card component for displaying content.
            </p>
            <div className="prose max-w-none">
              <h2>Usage</h2>
              <pre className="rounded-lg bg-muted p-4">
                <code>{`import { Card } from "@nui/core";

<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
  </Card.Header>
  <Card.Content>
    Card content goes here.
  </Card.Content>
</Card>`}</code>
              </pre>
            </div>
          </div>
        );
      case "input":
        return (
          <div>
            <h1 className="mb-6 font-bold text-3xl">Input</h1>
            <p className="mb-4 text-lg">
              A styled input component with validation support.
            </p>
            <div className="prose max-w-none">
              <h2>Usage</h2>
              <pre className="rounded-lg bg-muted p-4">
                <code>{`import { Input } from "@nui/core";

<Input placeholder="Enter text..." />
<Input type="email" placeholder="Email" />
<Input disabled placeholder="Disabled input" />`}</code>
              </pre>
            </div>
          </div>
        );
      default:
        return (
          <div>
            <h1 className="mb-6 font-bold text-3xl">Components</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Explore our collection of customizable components built with Base
              UI and Tailwind CSS.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <a
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                href="/components/button"
              >
                <h3 className="mb-2 font-semibold">Button</h3>
                <p className="text-muted-foreground text-sm">
                  Customizable button component
                </p>
              </a>
              <a
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                href="/components/card"
              >
                <h3 className="mb-2 font-semibold">Card</h3>
                <p className="text-muted-foreground text-sm">
                  Flexible card component
                </p>
              </a>
              <a
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                href="/components/input"
              >
                <h3 className="mb-2 font-semibold">Input</h3>
                <p className="text-muted-foreground text-sm">
                  Styled input component
                </p>
              </a>
              <a
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                href="/components/badge"
              >
                <h3 className="mb-2 font-semibold">Badge</h3>
                <p className="text-muted-foreground text-sm">
                  Small status indicators
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

const ComponentsPage: React.FC = () => {
  return (
    <Routes>
      <Route element={<ComponentsContent />} path="/*" />
    </Routes>
  );
};

export default ComponentsPage;
