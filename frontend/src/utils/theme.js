const THEME_STORAGE_KEY = "theme";

export function getSavedTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) || "light";
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
