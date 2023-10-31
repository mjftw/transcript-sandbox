// Required for useSpeechRecognition hook to work
import "regenerator-runtime/runtime";

import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import usePhoenixChannel from "~/hooks/usePhoenixChannel";

const TOPIC = "chat:42";

type Payload = {
  message: string;
  user: string;
};

type Props = {
  phoenixSocketUrl: string;
  phoenixSecretKey: string;
};

function Chat({ phoenixSocketUrl, phoenixSecretKey }: Props) {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [channelJoined, setChannelJoined] = useState(false);
  const [received, setReceived] = useState<Payload[]>([]);

  const appendReceived = (payload: Payload) => {
    setReceived((prevReceived) => [...prevReceived, payload]);
  };

  const { connected, sendMessage } = usePhoenixChannel<Payload>({
    config: {
      url: phoenixSocketUrl,
      topic: TOPIC,
      channelParams: { secret: phoenixSecretKey },
    },
    callbacks: {
      onMessages: [
        {
          event: "new_message",
          callback: (payload) => {
            appendReceived(payload);
          },
        },
      ],
      onChannelJoinError: (resp) => {
        console.log("Unable to join", resp);
        setChannelJoined(false);
      },
      onChannelJoinOk: (resp) => {
        console.log("Joined successfully", resp);
        setChannelJoined(true);
      },
    },
  });

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!listening) {
      sendMessage("send_message", {
        message: transcript,
        user: username,
      });
      resetTranscript();
      setMessage("");
    }
  }, [listening]);

  const isSendButtonDisabled =
    !username.trim() || !message.trim() || !connected || listening;

  const isDictateButtonDisabled =
    listening || !browserSupportsSpeechRecognition;

  const isChannelConnected = connected && channelJoined;

  return (
    <div className=" m-5 flex flex-col gap-3">
      <div>
        Phoenix{" "}
        {isChannelConnected ? (
          <span className="rounded-full bg-green-800 px-3 py-1 text-white ring-green-950">
            connected
          </span>
        ) : (
          <span className="rounded-full bg-red-800 px-3 py-1 text-white ring-red-950">
            disconnected
          </span>
        )}
      </div>
      <div className=" grid grid-cols-3 gap-2">
        <ul className="rounded border border-gray-400 bg-blue-100 p-2">
          {received.map((payload, index) => (
            <li key={index}>
              {payload.user}: {payload.message}
            </li>
          ))}
        </ul>

        <textarea
          placeholder="Message"
          className="rounded border border-gray-400 p-2"
          value={listening ? transcript : message}
          disabled={listening}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            className="rounded border border-gray-400 p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="flex flex-row gap-1">
            <button
              className={`rounded px-4 py-2 text-white 
            ${
              isSendButtonDisabled
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
              onClick={() => {
                sendMessage("send_message", {
                  message: message,
                  user: username,
                });
                setMessage("");
                resetTranscript();
              }}
              disabled={isSendButtonDisabled}
            >
              Send Message
            </button>
            <button
              className={`rounded px-4 py-2 text-white 
            ${
              isDictateButtonDisabled
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
              onClick={() => {
                setMessage("");
                SpeechRecognition.startListening();
              }}
              disabled={isDictateButtonDisabled}
            >
              {browserSupportsSpeechRecognition
                ? "Dictate message"
                : "Browser does not support speech recognition"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
