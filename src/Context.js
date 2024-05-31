import { createContext, useState, useContext } from "react";

export const AppModeContext = createContext(null);
export const UserDataContext = createContext({ role: null });

const GlobalLoadingContext = createContext();
export const GlobalLoadingProvider = ({ children }) => {
  const [globalLoadingVisible, setGlobalLoadingVisible] = useState(false);
  const [globalLoadingContent, setGlobalLoadingContent] = useState("loading");

  const showGlobalLoading = (content = "loading") => {
    setGlobalLoadingContent(content);
    setGlobalLoadingVisible(true);
  };

  const hideGlobalLoading = () => {
    setGlobalLoadingVisible(false);
    setGlobalLoadingContent("loading");
  };

  return (
    <GlobalLoadingContext.Provider value={{ globalLoadingVisible, globalLoadingContent, showGlobalLoading, hideGlobalLoading }}>
      {children}
    </GlobalLoadingContext.Provider>
  );
};
/**
 *
 * @returns {{globalLoadingVisible: boolean, globalLoadingContent: string, showGlobalLoading: function(content), hideGlobalLoading: function()}}
 */
export const useGlobalLoading = () => useContext(GlobalLoadingContext);
