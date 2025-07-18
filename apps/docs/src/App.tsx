import { DocsLayout, ThemeProvider } from "@nui/core";
import { BrowserRouter } from "react-router-dom";

import "./styles/globals.css";

import { navigation } from "virtual:docs-contents";
import DocsRouter from "./components/docs-router";
import HeaderNavigation from "./components/header-navigation";
import SidebarNavigation from "./components/sidebar-navigation";
import {
  NavigationProvider,
  useNavigation,
} from "./contexts/navigation-context";

console.log("Navigation structure: ", navigation);

const AppContent: React.FC = () => {
  const { activeSection } = useNavigation();

  return (
    <DocsLayout
      header={{
        navigation: <HeaderNavigation navigation={navigation} />,
      }}
      sidebar={{
        children: (
          <SidebarNavigation
            activeSection={activeSection}
            navigation={navigation}
          />
        ),
      }}
    >
      <DocsRouter />
    </DocsLayout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <NavigationProvider navigation={navigation}>
          <AppContent />
        </NavigationProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
