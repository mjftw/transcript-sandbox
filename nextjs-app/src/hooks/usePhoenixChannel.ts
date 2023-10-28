import { on } from "events";
import { Channel, Socket } from "phoenix";
import React, { useState, useEffect } from "react";
import useOnMount from "~/hooks/useOnMount";
import { connect } from "~/utils/phoenixChannel";

const url = "ws://localhost:4000/socket";

function usePhoenixChannel<T extends object>({
  url,
  topic,
  onJoinOk,
  onJoinError,
  onSocketError,
  onMessages,
  socketParams,
  channelParams,
}: {
  url: string;
  topic: string;
  onMessages?: { event: string; callback: (resp: T) => void }[];
  onJoinOk?: (resp: any) => any;
  onJoinError?: (resp: any) => any;
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
      onJoinError: (resp) => {
        setConnected(true);
        onJoinError && onJoinError(resp);
      },
      onJoinOk,
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
    console.log("Connected: ", connected);
    console.log("Topic: ", topic);
    console.log("Payload: ", payload);
    if (channel) {
      channel.push(topic, payload);
    }
  };

  return { connected, sendMessage };
}

export default usePhoenixChannel;
