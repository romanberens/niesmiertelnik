import { EquipmentSample, ScbaStatus } from "../types/api";
import { createStore } from "./baseStore";
import { evaluateScba, batteryThresholds } from "../utils/thresholds";

export interface EquipmentState {
  samples: Record<string, EquipmentSample>;
  scbaStatus: Record<string, "normal" | "warning" | "critical">;
  batteryStatus: Record<string, "normal" | "warning" | "critical">;
  passStatus: Record<string, boolean>;
  blackBoxStatus: Record<string, boolean>;
}

const initialState: EquipmentState = {
  samples: {},
  scbaStatus: {},
  batteryStatus: {},
  passStatus: {},
  blackBoxStatus: {},
};

export const equipmentStore = createStore<EquipmentState>(initialState);

export function updateEquipment(tagId: string, equipment: EquipmentSample) {
  equipmentStore.setState((prev) => {
    const scbaState = evaluateScba(equipment.scba);
    const batteryState = equipment.battery_pct !== undefined
      ? equipment.battery_pct < batteryThresholds.criticalMax
        ? "critical"
        : equipment.battery_pct < batteryThresholds.warningMax
        ? "warning"
        : "normal"
      : "normal";
    return {
      samples: { ...prev.samples, [tagId]: equipment },
      scbaStatus: { ...prev.scbaStatus, [tagId]: scbaState },
      batteryStatus: { ...prev.batteryStatus, [tagId]: batteryState },
      passStatus: { ...prev.passStatus, [tagId]: equipment.pass.active },
      blackBoxStatus: { ...prev.blackBoxStatus, [tagId]: equipment.black_box?.recording ?? false },
    };
  });
}

export function ingestScbaFromRest(scbaList: Record<string, ScbaStatus>) {
  equipmentStore.setState((prev) => {
    const scbaStatus: EquipmentState["scbaStatus"] = { ...prev.scbaStatus };
    Object.entries(scbaList).forEach(([tagId, scba]) => {
      scbaStatus[tagId] = evaluateScba(scba);
    });
    return { ...prev, scbaStatus };
  });
}
