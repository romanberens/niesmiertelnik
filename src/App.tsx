import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout/index";
import CommandCenter from "./views/CommandCenter";
import Dashboard from "./views/Dashboard";
import Environment from "./views/Environment";
import Equipment from "./views/Equipment";
import TeamStatus from "./views/TeamStatus";
import Communications from "./views/Communications";
import BuildingMap from "./views/BuildingMap";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="command-center" replace />} />
        <Route path="command-center" element={<CommandCenter />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="environment" element={<Environment />} />
        <Route path="equipment" element={<Equipment />} />
        <Route path="team-status" element={<TeamStatus />} />
        <Route path="communications" element={<Communications />} />
        <Route path="map" element={<BuildingMap />} />
      </Route>
    </Routes>
  );
};

export default App;
