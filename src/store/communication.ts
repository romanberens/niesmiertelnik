import { createStore } from "./baseStore";
import { EmergencyBroadcastEvent, MessageEvent, NibStatus, VoiceEvent, WelcomeEvent } from "../types/api";

export interface CommunicationState {
  messages: MessageEvent[];
  voice: VoiceEvent[];
  emergency?: EmergencyBroadcastEvent;
  nib?: NibStatus;
  capabilities: string[];
  welcome?: WelcomeEvent;
}

const initialState: CommunicationState = {
  messages: [],
  voice: [],
  capabilities: [],
};

export const communicationStore = createStore<CommunicationState>(initialState);

export function ingestMessage(event: MessageEvent) {
  communicationStore.setState((prev) => ({ ...prev, messages: [...prev.messages, event] }));
}

export function ingestVoice(event: VoiceEvent) {
  communicationStore.setState((prev) => ({ ...prev, voice: [...prev.voice, event] }));
}

export function ingestEmergency(event: EmergencyBroadcastEvent) {
  communicationStore.setState((prev) => ({ ...prev, emergency: event }));
}

export function updateNibStatus(status: NibStatus) {
  communicationStore.setState((prev) => ({ ...prev, nib: status }));
}

export function setWelcome(event: WelcomeEvent) {
  communicationStore.setState((prev) => ({ ...prev, welcome: event, capabilities: event.capabilities }));
}
