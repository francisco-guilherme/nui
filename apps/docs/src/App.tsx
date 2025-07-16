import { DocsLayout, ThemeProvider } from "@nui/core";
import { BrowserRouter } from "react-router-dom";

import "./styles/globals.css";

import { contents } from "virtual:docs-contents";
import { directoryTree } from "virtual:docs-directory-tree";
import RecursiveDirectoryDemo from "./pages/RecursiveDirectoryDemo";

console.log("Directory-grouped contents: ", contents);
console.log("Directory tree structure: ", directoryTree);

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <DocsLayout>
          <RecursiveDirectoryDemo />
        </DocsLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
