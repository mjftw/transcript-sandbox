import "regenerator-runtime/runtime";
import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import usePhoenixChannel from "~/hooks/usePhoenixChannel";

const URL = "ws://localhost:4000/socket";
const CHAT_ROOM = 42;
const TOPIC = "send_message";

type Payload = {
  message: string;
  user: string;
};

function Chat() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [received, setReceived] = useState<Payload[]>([]);

  const appendReceived = (payload: Payload) => {
    setReceived((prevReceived) => [...prevReceived, payload]);
  };

  const { connected, sendMessage } = usePhoenixChannel<Payload>({
    url: URL,
    topic: `chat:${CHAT_ROOM}`,
    onMessages: [
      {
        event: "new_message",
        callback: (payload) => {
          appendReceived(payload);
        },
      },
    ],
    onChannelJoinError: (resp) => console.log("Unable to join", resp),
    onChannelJoinOk: (resp) => console.log("Joined successfully", resp),
  });

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!listening) {
      sendMessage(TOPIC, { message: transcript, user: username });
      resetTranscript();
      setMessage("");
    }
  }, [listening]);

  const isSendButtonDisabled =
    !username.trim() || !message.trim() || !connected || listening;

  const isDictateButtonDisabled =
    listening || !browserSupportsSpeechRecognition;

  return (
    <div className="m-5 grid grid-cols-3 gap-2">
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
  );
}

export default Chat;
