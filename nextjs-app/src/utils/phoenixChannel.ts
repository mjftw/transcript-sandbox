import { Channel, Socket } from "phoenix";

type Config = {
  url: string;
  topic: string;
  socketParams?: object;
  channelParams?: object;
};

type Callbacks<T> = {
  setConnected?: (connected: boolean) => void;
  onMessages?: { event: string; callback: (resp: T) => void }[];
  onChannelJoinOk?: (resp: any) => any;
  onChannelJoinError?: (resp: any) => any;
  onSocketError?: (error: string | number | Event) => void;
};

type ConnectionParams<T> = {
  config: Config;
  callbacks: Callbacks<T>;
};

function connect<T>({
  config: { url, topic, socketParams, channelParams },
  callbacks: {
    setConnected = () => {},
    onMessages = [],
    onChannelJoinOk = () => {},
    onChannelJoinError = () => {},
    onSocketError = (resp) => {},
  },
}: ConnectionParams<T>): { socket: Socket; channel: Channel } {
  const socket = new Socket(url);
  onSocketError && socket.onError((err) => onSocketError(err));

  socket.connect(socketParams);

  socket.onOpen(() => setConnected(true));
  socket.onError((err) => {
    onSocketError && onSocketError(err);
    setConnected(false);
  });
  socket.onClose(() => setConnected(false));

  const channel = socket.channel(topic, channelParams);

  channel
    .join()
    .receive("ok", onChannelJoinOk)
    .receive("error", onChannelJoinError);

  onMessages.forEach(({ event, callback }) => {
    channel.on(event, callback);
  });

  return { socket, channel };
}

export { connect };
export type { Config, Callbacks, ConnectionParams };
