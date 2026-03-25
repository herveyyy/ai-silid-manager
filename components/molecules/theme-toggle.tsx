"use client";

import { useState } from "react";
import { FaRegMoon } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";

type Theme = "dark" | "light";

const STORAGE_KEY = "silid-theme";

function applyTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
}

function getInitialTheme(): Theme {
    if (typeof document !== "undefined") {
        const domTheme = document.documentElement.dataset.theme;
        if (domTheme === "light" || domTheme === "dark") {
            return domTheme;
        }
    }

    if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        return savedTheme === "light" ? "light" : "dark";
    }

    return "dark";
}

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={() => {
                const nextTheme: Theme = isDark ? "light" : "dark";
                setTheme(nextTheme);
                applyTheme(nextTheme);
            }}
            className=" border px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] transition-colors theme-panel theme-link"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            {isDark ? (
                <MdOutlineWbSunny className="w-3 h-3" />
            ) : (
                <FaRegMoon className="w-3 h-3" />
            )}
        </button>
    );
}
