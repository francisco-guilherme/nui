import { DocsLayout, ThemeProvider } from "@nui/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./styles/globals.css";
import { layoutConfig } from "./config/layout";
import ComponentsPage from "./pages/ComponentsPage";
import DocsPage from "./pages/DocsPage";
// Import page components
import HomePage from "./pages/HomePage";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <DocsLayout
          description={layoutConfig.description}
          header={layoutConfig.header}
          sidebar={layoutConfig.sidebar}
          title={layoutConfig.title}
        >
          <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<DocsPage />} path="/docs/*" />
            <Route element={<ComponentsPage />} path="/components/*" />
          </Routes>
        </DocsLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
