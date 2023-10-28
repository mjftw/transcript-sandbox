import { Channel, Socket } from "phoenix";

type ConnectionParams<T> = {
  url: string;
  topic: string;
  onMessages?: { event: string; callback: (resp: T) => void }[];
  onJoinOk?: (resp: any) => void;
  onJoinError?: (resp: any) => void;
  onSocketError?: (error: string | number | Event) => void;
  socketParams?: object;
  channelParams?: object;
};

function connect<T>({
  url,
  topic,
  onMessages = [],
  onJoinOk = () => {},
  onJoinError = () => {},
  onSocketError,
  socketParams,
  channelParams,
}: ConnectionParams<T>): { socket: Socket; channel: Channel } {
  const socket = new Socket(url);
  onSocketError && socket.onError((err) => onSocketError(err));

  socket.connect(socketParams);

  const channel = socket.channel(topic, channelParams);

  channel.join().receive("ok", onJoinOk).receive("error", onJoinError);

  onMessages.forEach(({ event, callback }) => {
    channel.on(event, callback);
  });

  return { socket, channel };
}

export { connect };
