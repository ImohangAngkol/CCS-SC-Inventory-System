import { useEffect, useState } from 'react';

const THEME_KEY = 'scis_theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light'|'dark'>(() => (localStorage.getItem(THEME_KEY) as 'light'|'dark') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <button className="btn secondary" onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}>
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
}
