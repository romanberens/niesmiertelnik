import { BeaconStatus, BuildingConfig } from "../types/api";
import { createStore } from "./baseStore";

export interface BuildingState {
  building?: BuildingConfig;
  beacons: BeaconStatus[];
  selectedFloor?: number;
}

const initialState: BuildingState = {
  beacons: [],
};

export const buildingStore = createStore<BuildingState>(initialState);

export function setBuilding(config: BuildingConfig) {
  buildingStore.setState((prev) => ({ ...prev, building: config, selectedFloor: config.floors?.[0] }));
}

export function updateBeacons(beacons: BeaconStatus[]) {
  buildingStore.setState((prev) => ({ ...prev, beacons }));
}

export function selectFloor(floor: number) {
  buildingStore.setState((prev) => ({ ...prev, selectedFloor: floor }));
}
