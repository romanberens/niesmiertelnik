import { useEffect } from "react";
import {
  communicationStore,
  ingestEmergency,
  ingestMessage,
  ingestVoice,
  setWelcome,
  updateNibStatus,
} from "../store/communication";
import { EmergencyBroadcastEvent, MessageEvent, NibStatus, VoiceEvent, WelcomeEvent } from "../types/api";
import { useStore } from "./useStore";

export function useCommunication(opts?: {
  message?: MessageEvent;
  voice?: VoiceEvent;
  emergency?: EmergencyBroadcastEvent;
  nib?: NibStatus;
  welcome?: WelcomeEvent;
}) {
  useEffect(() => {
    if (opts?.message) ingestMessage(opts.message);
    if (opts?.voice) ingestVoice(opts.voice);
    if (opts?.emergency) ingestEmergency(opts.emergency);
    if (opts?.nib) updateNibStatus(opts.nib);
    if (opts?.welcome) setWelcome(opts.welcome);
  }, [opts?.message, opts?.voice, opts?.emergency, opts?.nib, opts?.welcome]);

  return useStore(communicationStore);
}
