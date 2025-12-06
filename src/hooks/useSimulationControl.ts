import { restApi } from "../api/rest";
import { PspWebSocketClient } from "../api/websocket";
import { OutgoingMessage } from "../types/api";

export function useSimulationControl(client?: PspWebSocketClient) {
  const sendWs = (message: OutgoingMessage) => {
    client?.send(message);
  };

  return {
    getHistory: () => sendWs({ type: "simulation_control", command: "get_history" }),
    setSpeed: (speed: number) => sendWs({ type: "simulation_control", command: "set_speed", payload: { speed } }),
    pause: () => sendWs({ type: "simulation_control", command: "pause" }),
    resume: () => sendWs({ type: "simulation_control", command: "resume" }),
    startRecording: () => restApi.startRecording(),
    stopRecording: () => restApi.stopRecording(),
    startReplay: (incidentId: string) => restApi.replayIncident(incidentId),
    triggerHazard: (hazard_type: string) => sendWs({ type: "simulation_control", command: "trigger_environment_hazard", payload: { hazard_type } }),
    triggerManDown: (id: string) => sendWs({ type: "simulation_control", command: "trigger_man_down", payload: { id } }),
  };
}
