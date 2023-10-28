import { Channel, Socket } from "phoenix";
import { useState, useEffect } from "react";
import { connect } from "~/utils/phoenixChannel";

function usePhoenixChannel<T extends object = any>({
  url,
  topic,
  onSendError,
  onChannelJoinOk,
  onChannelJoinError,
  onSocketError,
  onMessages,
  socketParams,
  channelParams,
}: {
  url: string;
  topic: string;
  onMessages?: { event: string; callback: (resp: T) => void }[];
  onSendError?: (error: string) => void;
  onChannelJoinOk?: (resp: any) => any;
  onChannelJoinError?: (resp: any) => any;
  onSocketError?: (error: string | number | Event) => void;
  socketParams?: object;
  channelParams?: object;
}) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const { socket, channel } = connect({
      url,
      topic,
      onMessages,
      setConnected,
      onChannelJoinError: (resp) => {
        onChannelJoinError && onChannelJoinError(resp);
      },
      onChannelJoinOk,
      onSocketError,
      socketParams,
      channelParams,
    });
    setChannel(channel);

    return () => {
      channel && channel.leave();
      socket && socket.disconnect();
    };
  }, []);

  const sendMessage = (topic: string, payload: T) => {
    if (channel && connected) {
      channel.push(topic, payload);
    } else {
      onSendError && onSendError("Not connected");
    }
  };

  return { connected, sendMessage };
}

export default usePhoenixChannel;
