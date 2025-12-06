export const formatTemperatureC = (value?: number) =>
  value === undefined ? "--" : `${value.toFixed(1)}°C`;

export const formatPercentage = (value?: number) =>
  value === undefined ? "--" : `${value.toFixed(1)}%`;

export const formatPpm = (value?: number) =>
  value === undefined ? "--" : `${value.toFixed(0)} ppm`;

export const formatTimestamp = (value?: string) => (value ? new Date(value).toLocaleTimeString() : "--");
