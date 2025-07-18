import { cn } from "@nui/core";

interface PreviewProps {
  name: string;
  className?: string;
}

export const Preview: React.FC<PreviewProps> = ({ name, className }) => {
  return (
    <div className={cn("not-prose my-6", className)}>
      <div className="rounded-lg border bg-background">
        {/* Preview header */}
        <div className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Preview</h4>
            <div className="flex items-center gap-2">
              <button
                className="rounded-md px-2 py-1 text-xs hover:bg-muted"
                type="button"
              >
                Copy
              </button>
              <button
                className="rounded-md px-2 py-1 text-xs hover:bg-muted"
                type="button"
              >
                Code
              </button>
            </div>
          </div>
        </div>

        {/* Preview content */}
        <div className="p-6">
          <div className="flex min-h-[200px] items-center justify-center rounded-md border border-dashed bg-muted/50">
            <div className="text-center">
              <div className="text-muted-foreground text-sm">
                Preview: {name}
              </div>
              <div className="mt-2 text-muted-foreground text-xs">
                Component preview would be rendered here
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
