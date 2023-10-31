import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { env } from "process";
import { useState } from "react";

// Load WaitingRoom component only on the client side
const VideoChat = dynamic(() => import("~/components/whereby/VideoChat"), {
  ssr: false,
});

export const getServerSideProps = (async (context) => {
  if (!env.PHOENIX_WEBSOCKET_URL) {
    throw new Error("env.PHOENIX_WEBSOCKET_URL is not set");
  }

  if (!env.PHOENIX_WEBSOCKET_SECRET) {
    throw new Error("env.PHOENIX_WEBSOCKET_SECRET is not set");
  }

  return {
    props: {
      phoenixSocketUrl: env.PHOENIX_WEBSOCKET_URL,
      phoenixSecretKey: env.PHOENIX_WEBSOCKET_SECRET,
    },
  };
}) satisfies GetServerSideProps<{
  phoenixSocketUrl: string;
  phoenixSecretKey: string;
}>;

function Meeting({
  phoenixSocketUrl,
  phoenixSecretKey,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [username, setUsername] = useState("");
  const [roomUrl, setRoomUrl] = useState("");

  const [joined, setJoined] = useState(false);

  const joinButtonDisabled = !username.trim() || !roomUrl.trim();

  if (!joined) {
    return (
      <div className="w flex flex-col gap-2 p-2">
        <div>
          <input
            type="text"
            placeholder="Username"
            className="rounded border border-gray-400 p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-3">
          <input
            type="text"
            placeholder="Whereby Room URL"
            className="rounded border border-gray-400 p-2"
            value={roomUrl}
            onChange={(e) => setRoomUrl(e.target.value)}
          />
          <button
            className={`rounded px-4 py-2 text-white
          ${
            joinButtonDisabled ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
            onClick={(e) => setJoined(true)}
            disabled={joinButtonDisabled}
          >
            Join meeting
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <VideoChat
        phoenixSocketUrl={phoenixSocketUrl}
        phoenixSecretKey={phoenixSecretKey}
        username={username}
        roomUrl={roomUrl}
      />
    );
  }
}

export default Meeting;
