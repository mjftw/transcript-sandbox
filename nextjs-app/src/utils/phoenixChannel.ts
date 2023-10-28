import { Channel, Socket } from "phoenix";

type ConnectionParams<T> = {
  url: string;
  topic: string;
  setConnected?: (connected: boolean) => void;
  onMessages?: { event: string; callback: (resp: T) => void }[];
  onChannelJoinOk?: (resp: any) => void;
  onChannelJoinError?: (resp: any) => void;
  onSocketError?: (error: string | number | Event) => void;
  socketParams?: object;
  channelParams?: object;
};

function connect<T>({
  url,
  topic,
  setConnected = () => {},
  onMessages = [],
  onChannelJoinOk = () => {},
  onChannelJoinError = () => {},
  onSocketError,
  socketParams,
  channelParams,
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
