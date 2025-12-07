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
