import React, { useState, useEffect } from "react";
import usePhoenixChannel from "~/hooks/usePhoenixChannel";

const url = "ws://localhost:4000/socket";
const chatRoom = 42;
const username = "John Doe";

type Payload = {
  message: string;
  user: string;
};

function Chat() {
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
    onJoinError: (resp) => console.log("Unable to join", resp),
    onJoinOk: (resp) => console.log("Joined successfully", resp),
  });

  return (
    <div className="m-5 grid w-1/2 grid-cols-3 gap-2">
      <ul className="rounded border border-gray-400 bg-blue-100">
        {received.map((payload, index) => (
          <li key={index}>{payload.message}</li>
        ))}
      </ul>

      <textarea
        className="rounded border border-gray-400 p-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="w-fit rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => sendMessage("send_message", { message, user: username })}
      >
        Send Message
      </button>
    </div>
  );
}

export default Chat;
