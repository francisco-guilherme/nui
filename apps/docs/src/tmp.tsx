import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from "@nui/core";
import { useState } from "react";

export const Tmp = () => {
  const [count, setCount] = useState(0);
  const [email, setEmail] = useState("");

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <h1 className="mb-4 font-bold text-4xl text-foreground">
          Welcome to NUI Documentation
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-xl">
          A modern React component library built with TypeScript and Tailwind
          CSS. Experience beautiful, accessible components with full theme
          support.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">
            View Components
          </Button>
        </div>
      </div>

      {/* Button Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Button Variants & Sizes</CardTitle>
          <CardDescription>
            All styles defined directly in CVA with Tailwind utility classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Variants */}
            <div>
              <h4 className="mb-3 font-medium text-muted-foreground text-sm">
                Variants
              </h4>
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h4 className="mb-3 font-medium text-muted-foreground text-sm">
                Sizes
              </h4>
              <div className="flex items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Example */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Counter</CardTitle>
          <CardDescription>Counter with dynamic badge variants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setCount(count - 1)}
              size="sm"
              variant="outline"
            >
              -
            </Button>
            <span className="min-w-[3rem] text-center font-bold text-2xl text-foreground">
              {count}
            </span>
            <Button
              onClick={() => setCount(count + 1)}
              size="sm"
              variant="outline"
            >
              +
            </Button>
            <Badge
              variant={(() => {
                if (count > 10) {
                  return "success";
                }
                if (count > 5) {
                  return "warning";
                }
                if (count < 0) {
                  return "danger";
                }
                return "default";
              })()}
            >
              {(() => {
                if (count > 10) {
                  return "High";
                }
                if (count > 5) {
                  return "Medium";
                }
                if (count < 0) {
                  return "Negative";
                }
                return "Low";
              })()}
            </Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setCount(0)} size="sm" variant="secondary">
            Reset
          </Button>
        </CardFooter>
      </Card>

      {/* Form Example */}
      <Card>
        <CardHeader>
          <CardTitle>Form Components</CardTitle>
          <CardDescription>
            Input variants and form validation states
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label
                className="mb-2 block font-medium text-foreground text-sm"
                htmlFor="email-input"
              >
                Email Address
              </label>
              <Input
                id="email-input"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                type="email"
                value={email}
              />
            </div>

            <div>
              <label
                className="mb-2 block font-medium text-foreground text-sm"
                htmlFor="input-states-default"
              >
                Input States
              </label>
              <div className="space-y-3">
                <Input id="input-states-default" placeholder="Default state" />
                <Input
                  defaultValue="invalid-email"
                  id="input-states-error"
                  placeholder="Error state"
                />
                <Input
                  defaultValue="valid@email.com"
                  id="input-states-success"
                  placeholder="Success state"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2">
            <Button>Submit Form</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
