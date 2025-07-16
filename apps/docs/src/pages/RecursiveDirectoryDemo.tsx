import type React from "react";
import { contents } from "virtual:docs-contents";
import { directoryTree } from "virtual:docs-directory-tree";

interface DirectoryNode {
  name: string;
  path: string;
  contents: Array<{
    name: string;
    path: string;
    file: string;
    frontmatter: Record<string, unknown>;
  }>;
  subdirectories: Record<string, DirectoryNode>;
}

const DirectoryTreeView: React.FC<{ 
  node: DirectoryNode; 
  level?: number;
}> = ({ node, level = 0 }) => {
  const indent = level * 20;
  
  return (
    <div style={{ marginLeft: `${indent}px` }} className="border-l border-muted pl-4">
      <div className="mb-2">
        <h3 className="font-semibold text-lg">
          📁 {node.name || 'Root'} 
          <span className="text-sm text-muted-foreground ml-2">
            ({node.contents.length} files)
          </span>
        </h3>
        
        {/* Show files in this directory */}
        {node.contents.length > 0 && (
          <div className="ml-4 space-y-1">
            {node.contents.map((content) => (
              <div key={content.path} className="text-sm p-2 bg-muted/30 rounded">
                <div className="font-medium">
                  📄 {(content.frontmatter.title as string) || content.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Path: {content.path} | File: {content.file}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Recursively render subdirectories */}
      {Object.entries(node.subdirectories).map(([subdirName, subdirNode]) => (
        <DirectoryTreeView 
          key={subdirName} 
          node={subdirNode} 
          level={level + 1} 
        />
      ))}
    </div>
  );
};

export default function RecursiveDirectoryDemo() {
  const flatDirectories = Object.keys(contents);
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="mb-6 font-bold text-3xl">
          Infinite Recursive Directory Scanning Demo
        </h1>
        <p className="text-lg text-muted-foreground">
          This demo shows how the docs plugin now supports infinite levels of directory nesting.
        </p>
      </div>

      {/* Flat Directory List */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 font-semibold text-2xl">Flat Directory Structure</h2>
        <p className="mb-4 text-muted-foreground">
          All directories found (flattened for backward compatibility):
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {flatDirectories.map((dir) => (
            <div key={dir} className="p-3 bg-muted/50 rounded border">
              <div className="font-medium">{dir}</div>
              <div className="text-sm text-muted-foreground">
                {contents[dir]?.length || 0} files
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nested Directory Tree */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 font-semibold text-2xl">Nested Directory Tree</h2>
        <p className="mb-4 text-muted-foreground">
          The actual nested structure with infinite recursion:
        </p>
        {directoryTree ? (
          <DirectoryTreeView node={directoryTree} />
        ) : (
          <p className="text-muted-foreground">No directory tree available</p>
        )}
      </div>

      {/* Statistics */}
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 font-semibold text-2xl">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded">
            <div className="font-semibold text-2xl">
              {flatDirectories.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Directories (including nested)
            </div>
          </div>
          <div className="p-4 bg-muted/30 rounded">
            <div className="font-semibold text-2xl">
              {Object.values(contents).reduce((sum, files) => sum + files.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Files
            </div>
          </div>
          <div className="p-4 bg-muted/30 rounded">
            <div className="font-semibold text-2xl">
              {Math.max(...flatDirectories.map(dir => dir.split('/').length))}
            </div>
            <div className="text-sm text-muted-foreground">
              Maximum Nesting Level
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
