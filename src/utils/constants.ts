export const COMMUNICATION_CHANNELS = [
  "team_alpha",
  "command",
  "all_units",
  "emergency",
];

export const ALERT_TYPES = [
  "man_down",
  "sos",
  "low_o2",
  "high_heart_rate",
  "scba_low_pressure",
  "scba_critical",
  "beacon_offline",
  "tag_offline",
  "explosive_gas",
  "high_temperature",
  "low_battery",
] as const;

export const CAPABILITIES = {
  WEATHER: "weather",
  RECCO: "recco",
  INCIDENTS: "incidents",
  RECORDING: "recording",
  SPEED_CONTROL: "speed_control",
};
