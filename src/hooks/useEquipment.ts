import { useEffect } from "react";
import { equipmentStore, updateEquipment, ingestScbaFromRest } from "../store/equipment";
import { EquipmentSample, ScbaStatus } from "../types/api";
import { useStore } from "./useStore";

export function useEquipment(tagId?: string, sample?: EquipmentSample) {
  useEffect(() => {
    if (tagId && sample) {
      updateEquipment(tagId, sample);
    }
  }, [tagId, sample]);

  const state = useStore(equipmentStore);
  return state;
}

export function useScbaFromRest(scbaMap?: Record<string, ScbaStatus>) {
  useEffect(() => {
    if (scbaMap) {
      ingestScbaFromRest(scbaMap);
    }
  }, [scbaMap]);
}
