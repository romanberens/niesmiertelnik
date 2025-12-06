import { useEffect } from "react";
import { reccoStore, ingestRecco } from "../store/recco";
import { ReccoDetectorEvent } from "../types/api";
import { useStore } from "./useStore";

export function useRecco(event?: ReccoDetectorEvent) {
  useEffect(() => {
    if (event) ingestRecco(event);
  }, [event]);

  return useStore(reccoStore);
}
