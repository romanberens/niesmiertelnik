import { EnvironmentSample } from "../types/api";
import { createStore } from "./baseStore";
import { evaluateEnvironment } from "../utils/thresholds";

export interface EnvironmentState {
  latest?: EnvironmentSample;
  status?: Record<string, "normal" | "warning" | "critical">;
}

const initialState: EnvironmentState = {};

export const environmentStore = createStore<EnvironmentState>(initialState);

export function updateEnvironment(sample: EnvironmentSample) {
  environmentStore.setState(() => ({ latest: sample, status: evaluateEnvironment(sample) }));
}
