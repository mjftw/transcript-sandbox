import { Channel } from "phoenix";
import { useState, useEffect } from "react";
import {
  Callbacks as SocketCallbacks,
  Config,
  connect,
} from "~/utils/phoenixChannel";

type HookCallbacks<T> = Omit<SocketCallbacks<T>, "setConnected"> & {
  onSendError?: (error: string) => void;
};

type Params<T> = {
  config: Config;
  callbacks: HookCallbacks<T>;
};

function usePhoenixChannel<T extends object = any>({
  config,
  callbacks,
}: Params<T>) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [connected, setConnected] = useState(false);

  const { onSendError, ...socketCallbacks } = callbacks;

  useEffect(() => {
    const { socket, channel } = connect({
      config,
      callbacks: {
        ...socketCallbacks,
        setConnected,
      },
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
