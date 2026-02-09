import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const syncThemeWithBackend = async (token, API) => {
    if (!token) return;
    
    try {
      // Get from backend
      const response = await fetch(`${API}/user/preferences`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.theme) {
          setTheme(data.theme);
        }
      }
    } catch (error) {
      console.error("Failed to sync theme:", error);
    }
  };

  const saveThemeToBackend = async (newTheme, token, API) => {
    if (!token) return;
    
    try {
      await fetch(`${API}/user/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ theme: newTheme }),
      });
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleTheme, 
      syncThemeWithBackend,
      saveThemeToBackend,
      isDark: theme === "dark" 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
