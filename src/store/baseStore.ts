type Listener<T> = (state: T) => void;

export function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<Listener<T>>();

  const setState = (updater: (prev: T) => T) => {
    state = updater(state);
    listeners.forEach((listener) => listener(state));
  };

  const subscribe = (listener: Listener<T>) => {
    listeners.add(listener);
    listener(state);
    return () => listeners.delete(listener);
  };

  const getState = () => state;

  return { setState, subscribe, getState };
}
