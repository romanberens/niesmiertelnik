import { ReccoDetectorEvent } from "../types/api";
import { createStore } from "./baseStore";

export interface ReccoState {
  last?: ReccoDetectorEvent;
  reflectors?: ReccoDetectorEvent["reflectors"];
}

const initialState: ReccoState = {};

export const reccoStore = createStore<ReccoState>(initialState);

export function ingestRecco(event: ReccoDetectorEvent) {
  reccoStore.setState(() => ({ last: event, reflectors: event.reflectors }));
}
