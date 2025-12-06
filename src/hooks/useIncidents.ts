import { useEffect } from "react";
import { incidentsStore, setIncidents, setRecordingStatus, setTimeline } from "../store/incidents";
import { IncidentItem, IncidentTimelineItem, RecordingStatus } from "../types/api";
import { useStore } from "./useStore";

export function useIncidents(opts?: {
  list?: IncidentItem[];
  timeline?: IncidentTimelineItem[];
  recording?: RecordingStatus;
}) {
  useEffect(() => {
    if (opts?.list) setIncidents(opts.list);
    if (opts?.timeline) setTimeline(opts.timeline);
    if (opts?.recording) setRecordingStatus(opts.recording);
  }, [opts?.list, opts?.timeline, opts?.recording]);

  return useStore(incidentsStore);
}
