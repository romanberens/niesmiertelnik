#!/bin/bash

echo "==> Usuwam błędny root/main.tsx (jeśli istnieje)..."
rm -f main.tsx

echo "==> Tworzę poprawny Layout..."
mkdir -p src/components/Layout
cat << 'LAYOUT' > src/components/Layout/index.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-neutral-950 text-gray-200">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
LAYOUT

echo "==> Tworzę poprawny Sidebar..."
mkdir -p src/components/Sidebar
cat << 'SIDEBAR' > src/components/Sidebar/index.tsx
import React from "react";
import { NavLink } from "react-router-dom";

const nav = [
  { to: "/command-center", label: "Command Center" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/team-status", label: "Team Status" },
  { to: "/environment", label: "Environment" },
  { to: "/equipment", label: "Equipment" },
  { to: "/communications", label: "Communications" },
  { to: "/map", label: "Building Map" },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-60 bg-neutral-800 h-full p-4 flex flex-col gap-2">
      {nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            \`block px-3 py-2 rounded \${isActive ? "bg-neutral-700 text-white" : "text-neutral-400"}\`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
SIDEBAR

echo "==> Tworzę poprawne main.tsx..."
cat << 'MAIN' > src/main.tsx
import "./styles/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
MAIN

echo "==> Tworzę styles/main.css..."
mkdir -p src/styles
cat << 'CSS' > src/styles/main.css
@tailwind base;
@tailwind components;
@tailwind utilities;
CSS

echo "==> Czyszczę cache Vite..."
rm -rf node_modules/.vite

echo "==> Skrypt zakończony."
