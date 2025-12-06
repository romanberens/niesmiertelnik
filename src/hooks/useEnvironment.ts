import { useEffect } from "react";
import { environmentStore, updateEnvironment } from "../store/environment";
import { EnvironmentSample } from "../types/api";
import { useStore } from "./useStore";

export function useEnvironment(sample?: EnvironmentSample) {
  useEffect(() => {
    if (sample) {
      updateEnvironment(sample);
    }
  }, [sample]);

  return useStore(environmentStore);
}
