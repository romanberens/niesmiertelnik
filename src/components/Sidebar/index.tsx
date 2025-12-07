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
            `block px-3 py-2 rounded ${
              isActive ? "bg-neutral-700 text-white" : "text-neutral-300"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
