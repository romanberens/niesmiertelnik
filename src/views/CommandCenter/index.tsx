import React from "react";

import AlertBanner from "../../components/AlertBanner";
import FloorSelector from "../../components/FloorSelector";
import MapCanvas from "../../components/MapCanvas";
import StatusBadge from "../../components/StatusBadge";
import FirefighterCard from "../../components/FirefighterCard";
import SensorTile from "../../components/SensorTile";

import { useBuilding } from "../../hooks/useBuilding";
import { useTelemetry } from "../../hooks/useTelemetry";
import { useAlerts } from "../../hooks/useAlerts";

const CommandCenter: React.FC = () => {
  const buildingState = useBuilding();         // << store
  const telemetry = useTelemetry();            // << store
  const alerts = useAlerts();                  // << store

  const building = buildingState.building;     // << real building config
  const floors = building?.floors ?? [];

  const [selected, setSelected] = React.useState<string | null>(null);

  // Building not loaded yet
  if (!building) {
    return (
      <div className="p-6 text-gray-400 text-center text-xl">
        Loading building data…
      </div>
    );
  }

  // Telemetry samples → array
  const firefighters = telemetry?.samples
    ? Object.values(telemetry.samples)
    : [];

  return (
    <div className="text-gray-200 px-6">

      {/* ALERTS */}
      <div className="pt-4">
        <AlertBanner alerts={alerts.alerts ?? {}} />
      </div>

      {/* FLOOR SELECTOR */}
      <div className="mt-4">
        <FloorSelector floors={floors} />
      </div>

      {/* MAP */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Floor Layout</h2>

        <MapCanvas
          building={buildingState}
          telemetry={telemetry}
          onSelectFirefighter={setSelected}
        />

        {/* Legend */}
        <div className="flex gap-4 mt-3 text-sm">
          <StatusBadge type="active" />
          <StatusBadge type="warning" />
          <StatusBadge type="danger" />
          <StatusBadge type="man_down" />
          <StatusBadge type="offline" />
        </div>
      </div>

      {/* FIREFIGHTER LIST */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Personnel</h2>

        <div className="space-y-2">
          {firefighters.map((tag: any) => (
            <FirefighterCard
              key={tag.tag_id}
              firefighter={tag}
              selected={selected === tag.tag_id}
              onClick={() => setSelected(tag.tag_id)}
            />
          ))}
        </div>
      </div>

      {/* SELECTED SENSOR TILE */}
      {selected && (
        <div className="mt-8 pb-10">
          <SensorTile firefighterId={selected} telemetry={telemetry} />
        </div>
      )}
    </div>
  );
};

export default CommandCenter;
