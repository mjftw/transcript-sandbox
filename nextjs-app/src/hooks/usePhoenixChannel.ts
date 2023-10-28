import { on } from "events";
import { Channel, Socket } from "phoenix";
import React, { useState, useEffect } from "react";
import useOnMount from "~/hooks/useOnMount";
import { connect } from "~/utils/phoenixChannel";

const url = "ws://localhost:4000/socket";

function usePhoenixChannel<T extends object>({
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
  const [socket, setSocket] = useState<Socket | null>(null);
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
    setSocket(socket);

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
