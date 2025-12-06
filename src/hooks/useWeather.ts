import { useEffect } from "react";
import { weatherStore, ingestWeather } from "../store/weather";
import { WeatherEvent } from "../types/api";
import { useStore } from "./useStore";

export function useWeather(event?: WeatherEvent) {
  useEffect(() => {
    if (event) ingestWeather(event);
  }, [event]);

  return useStore(weatherStore);
}
