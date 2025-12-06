import { createStore } from "./baseStore";
import { TagTelemetryEvent, TelemetryTag } from "../types/api";

export interface TelemetryState {
  samples: Record<string, TelemetryTag>;
}

const initialState: TelemetryState = {
  samples: {},
};

export const telemetryStore = createStore<TelemetryState>(initialState);

export function ingestTelemetry(event: TagTelemetryEvent) {
  telemetryStore.setState((prev) => {
    const samples = { ...prev.samples };
    event.data.forEach((sample) => {
      samples[sample.tag_id] = sample;
    });
    return { ...prev, samples };
  });
}

export const getTelemetryByTag = (tagId: string) => telemetryStore.getState().samples[tagId];
