import React, { useState, useEffect } from "react";
import { set } from "zod";
import usePhoenixChannel from "~/hooks/usePhoenixChannel";

const url = "ws://localhost:4000/socket";
const chatRoom = 42;

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
    url,
    topic: `chat:${chatRoom}`,
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

  return (
    <div className="m-5 grid w-1/2 grid-cols-3 gap-2">
      <ul className="rounded border border-gray-400 bg-blue-100">
        {received.map((payload, index) => (
          <li key={index}>
            {payload.user}: {payload.message}
          </li>
        ))}
      </ul>

      <textarea
        placeholder="Message"
        className="rounded border border-gray-400 p-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="flex flex-col gap-3">
        <textarea
          placeholder="Username"
          className="rounded border border-gray-400 p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="w-fit rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => {
            sendMessage("send_message", { message, user: username });
            setMessage("");
          }}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

export default Chat;
