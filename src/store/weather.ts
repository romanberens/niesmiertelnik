import { WeatherEvent, WeatherSample } from "../types/api";
import { createStore } from "./baseStore";

export interface WeatherState {
  latest?: WeatherSample;
  timestamp?: string;
}

const initialState: WeatherState = {};

export const weatherStore = createStore<WeatherState>(initialState);

export function ingestWeather(event: WeatherEvent) {
  weatherStore.setState(() => ({ latest: event.data, timestamp: event.timestamp }));
}
