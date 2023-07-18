export interface WebSocketEvents {
  onOpen?: () => void;
  onMessage?: (data: any) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
}

export default class WS {
  private socket: WebSocket | null = null;

  private onOpenCallback: (() => void) | undefined;

  private onMessageCallback: ((data: any) => void) | undefined;

  private onCloseCallback: ((event: CloseEvent) => void) | undefined;

  private onErrorCallback: ((error: Event) => void) | undefined;

  constructor(private url: string) {
    this.url = url;
  }

  connect(): void {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = (): void => {
      if (this.onOpenCallback) {
        this.onOpenCallback();
      }
    };

    this.socket.onmessage = (event: MessageEvent): void => {
      if (this.onMessageCallback) {
        this.onMessageCallback(JSON.parse(event.data));
      }
    };

    this.socket.onclose = (event: CloseEvent): void => {
      if (this.onCloseCallback) {
        this.onCloseCallback(event);
      }
    };

    this.socket.onerror = (error: Event): void => {
      if (this.onErrorCallback) {
        this.onErrorCallback(error);
      }
    };
  }

  send(data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const json = JSON.stringify(data);
      this.socket.send(json);
    }
  }

  close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  onOpen(callback: () => void): void {
    this.onOpenCallback = callback;
  }

  onMessage(callback: (data: any) => void): void {
    this.onMessageCallback = callback;
  }

  onClose(callback: (event: CloseEvent) => void): void {
    this.onCloseCallback = callback;
  }

  onError(callback: (error: Event) => void): void {
    this.onErrorCallback = callback;
  }
}
