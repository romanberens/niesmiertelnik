import { EnvironmentSample, ScbaStatus } from "../types/api";

export const environmentThresholds = {
  o2: { warningMin: 18, criticalMin: 18 },
  co: { warningMax: 35, criticalMax: 100 },
  co2: { warningMax: 1000, criticalMax: 5000 },
  lel: { warningMin: 10, criticalMin: 25 },
  temperature_c: { warningMax: 60, criticalMax: 260 },
  humidity_pct: { warningMax: 90 },
  voc_ppb: { warningMax: 500, criticalMax: 1000 },
  pm25_ugm3: { warningMax: 35, criticalMax: 55 },
};

export const scbaThresholds = {
  pressure_pct: { warningMax: 20, criticalMax: 10 },
};

export const batteryThresholds = {
  warningMax: 30,
  criticalMax: 15,
};

export function evaluateEnvironment(sample: EnvironmentSample) {
  const status: Record<string, "normal" | "warning" | "critical"> = {};
  status.o2 = sample.o2_pct < environmentThresholds.o2.criticalMin
    ? "critical"
    : sample.o2_pct < 19.5 && sample.o2_pct >= environmentThresholds.o2.criticalMin
    ? "warning"
    : "normal";

  status.co = sample.co_ppm > environmentThresholds.co.criticalMax
    ? "critical"
    : sample.co_ppm > environmentThresholds.co.warningMax
    ? "warning"
    : "normal";

  status.co2 = sample.co2_ppm > environmentThresholds.co2.criticalMax
    ? "critical"
    : sample.co2_ppm > environmentThresholds.co2.warningMax
    ? "warning"
    : "normal";

  status.lel = sample.lel_pct >= environmentThresholds.lel.criticalMin
    ? "critical"
    : sample.lel_pct >= environmentThresholds.lel.warningMin
    ? "warning"
    : "normal";

  status.temperature = sample.temperature_c > environmentThresholds.temperature_c.criticalMax
    ? "critical"
    : sample.temperature_c > environmentThresholds.temperature_c.warningMax
    ? "warning"
    : "normal";

  status.voc = sample.voc_ppb && sample.voc_ppb > (environmentThresholds.voc_ppb.criticalMax ?? Number.MAX_SAFE_INTEGER)
    ? "critical"
    : sample.voc_ppb && sample.voc_ppb > (environmentThresholds.voc_ppb.warningMax ?? Number.MAX_SAFE_INTEGER)
    ? "warning"
    : "normal";

  status.pm25 = sample.pm25_ugm3 && sample.pm25_ugm3 > (environmentThresholds.pm25_ugm3.criticalMax ?? Number.MAX_SAFE_INTEGER)
    ? "critical"
    : sample.pm25_ugm3 && sample.pm25_ugm3 > (environmentThresholds.pm25_ugm3.warningMax ?? Number.MAX_SAFE_INTEGER)
    ? "warning"
    : "normal";

  status.humidity = sample.humidity_pct > (environmentThresholds.humidity_pct.warningMax ?? Number.MAX_SAFE_INTEGER)
    ? "warning"
    : "normal";

  return status;
}

export function evaluateScba(scba: ScbaStatus) {
  if (scba.alarms?.very_low_pressure || scba.pressure_pct < scbaThresholds.pressure_pct.criticalMax) {
    return "critical" as const;
  }
  if (scba.alarms?.low_pressure || scba.pressure_pct < scbaThresholds.pressure_pct.warningMax) {
    return "warning" as const;
  }
  return "normal" as const;
}
