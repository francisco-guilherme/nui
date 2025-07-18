import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

import type { NavigationItem } from "../types/navigation";

interface NavigationContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
  navigation: NavigationItem[];
  setNavigation: (navigation: NavigationItem[]) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

interface NavigationProviderProps {
  children: React.ReactNode;
  navigation: NavigationItem[];
}

export const NavigationProvider = ({
  children,
  navigation: initialNavigation,
}: NavigationProviderProps) => {
  const [navigation, setNavigation] = useState(initialNavigation);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  const rootSections = useMemo(
    () => navigation.filter((item) => item.children?.length),
    [navigation]
  );

  const determineActiveSection = useCallback(
    (path: string): string => {
      for (const section of rootSections) {
        const sectionKey = section.title.toLowerCase();

        if (path.startsWith(`/${sectionKey}`)) {
          return sectionKey;
        }

        if (
          section.children?.some(
            (child) => path === child.href || path.startsWith(`${child.href}/`)
          )
        ) {
          return sectionKey;
        }
      }

      return rootSections[0]?.title.toLowerCase() || "";
    },
    [rootSections]
  );

  useEffect(() => {
    const newSection = determineActiveSection(location.pathname);
    if (newSection !== activeSection) {
      setActiveSection(newSection);
    }
  }, [location.pathname, determineActiveSection, activeSection]);

  const contextValue = useMemo(
    () => ({
      activeSection,
      setActiveSection,
      navigation,
      setNavigation,
    }),
    [activeSection, navigation]
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
