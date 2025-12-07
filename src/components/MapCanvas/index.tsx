import React from "react";

interface MapCanvasProps {
  building: any;
  telemetry: any;
  onSelectFirefighter: (id: string) => void;
}

const MapCanvas: React.FC<MapCanvasProps> = ({
  building,
  telemetry,
  onSelectFirefighter,
}) => {
  const samples = telemetry?.samples ? Object.values(telemetry.samples) : [];

  return (
    <div className="relative w-full h-[400px] bg-gray-800 rounded-md p-4">
      {/* Prosta siatka */}
      <div className="absolute inset-0 opacity-20 grid grid-cols-8 grid-rows-5 border border-gray-600">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="border border-gray-700"></div>
        ))}
      </div>

      {/* Ikony strażaków */}
      {samples.map((s: any) => {
        const pos = s?.position;
        if (!pos) return null;

        // Normalizacja do % mapy
        const x = (pos.x / building.dimensions.width_m) * 100;
        const y = (pos.y / building.dimensions.depth_m) * 100;

        return (
          <div
            key={s.tag_id}
            className="absolute bg-green-500 text-black text-xs font-bold px-2 py-1 rounded cursor-pointer"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => onSelectFirefighter(s.tag_id)}
          >
            {s.firefighter?.name ?? s.tag_id}
          </div>
        );
      })}
    </div>
  );
};

export default MapCanvas;
