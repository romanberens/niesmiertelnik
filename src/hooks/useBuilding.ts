import { useEffect } from "react";
import { buildingStore, setBuilding, updateBeacons, selectFloor } from "../store/building";
import { BeaconStatus, BuildingConfig } from "../types/api";
import { useStore } from "./useStore";

export function useBuilding(opts?: { config?: BuildingConfig; beacons?: BeaconStatus[]; floor?: number }) {
  useEffect(() => {
    if (opts?.config) setBuilding(opts.config);
    if (opts?.beacons) updateBeacons(opts.beacons);
    if (opts?.floor !== undefined) selectFloor(opts.floor);
  }, [opts?.config, opts?.beacons, opts?.floor]);

  return useStore(buildingStore);
}
