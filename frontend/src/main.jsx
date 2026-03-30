import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, useTheme } from "react-theme-switcher-kit";
import { useEffect } from "react";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { getSavedTheme } from "./utils/theme";

function ThemeBootstrap() {
  const { currentTheme, toggleTheme } = useTheme();

  useEffect(() => {
    toggleTheme(getSavedTheme());
  }, [toggleTheme]);

  useEffect(() => {
    const isDark = currentTheme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("dark", isDark);
  }, [currentTheme]);

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ThemeBootstrap />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
