export interface ServerToClientEvents {
  chatFromServer: (data: SocketData) => void;
}

export interface ClientToServerEvents {
  chatFromBrowser: (data: { message: string; token: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  message: string;
  username: string;
  avatar: string;
}
