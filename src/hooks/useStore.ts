import { useEffect, useState } from "react";
import { createStore } from "../store/baseStore";

type Store<T> = ReturnType<typeof createStore<T>>;

export function useStore<T>(store: Store<T>) {
  const [state, setState] = useState<T>(store.getState());

  useEffect(() => {
    const unsub = store.subscribe(setState);
    return () => unsub();
  }, [store]);

  return state;
}
