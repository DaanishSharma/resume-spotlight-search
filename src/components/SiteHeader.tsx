import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [light, setLight] = useState(false);
  useEffect(() => setLight(document.documentElement.classList.contains("light")), []);
  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");
  };
  return (
    <header className="mx-auto flex max-w-[960px] items-center justify-between px-6 py-6">
      <Link to="/" className="font-mono text-sm text-foreground hover:text-accent">
        ds
      </Link>
      <nav className="flex items-center gap-6 font-mono text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>
          home
        </Link>
        <Link to="/blog" className="hover:text-foreground" activeProps={{ className: "text-foreground" }}>
          blog
        </Link>
        <button onClick={toggle} aria-label="Toggle theme" className="hover:text-foreground">
          {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </nav>
    </header>
  );
}
