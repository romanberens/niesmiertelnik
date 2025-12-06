import { IncomingEvent, OutgoingMessage } from "../types/api";

type EventHandler = (event: IncomingEvent) => void;

type ConnectionOptions = {
  url: string;
  onEvent: EventHandler;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
};

export class PspWebSocketClient {
  private ws?: WebSocket;
  private opts: ConnectionOptions;

  constructor(opts: ConnectionOptions) {
    this.opts = opts;
  }

  connect() {
    this.ws = new WebSocket(this.opts.url);
    this.ws.onopen = () => this.opts.onOpen?.();
    this.ws.onclose = (ev) => this.opts.onClose?.(ev);
    this.ws.onerror = (ev) => this.opts.onError?.(ev as Event);
    this.ws.onmessage = (msg) => {
      try {
        const parsed: IncomingEvent = JSON.parse(msg.data);
        this.opts.onEvent(parsed);
      } catch (e) {
        console.error("Failed to parse incoming event", e);
      }
    };
  }

  send(message: OutgoingMessage) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify(message));
  }

  disconnect() {
    this.ws?.close();
  }
}
