import "regenerator-runtime/runtime";
import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  useLocalMedia,
  useRoomConnection,
  VideoView,
} from "@whereby.com/browser-sdk";
import usePhoenixChannel from "~/hooks/usePhoenixChannel";

const URL = "ws://localhost:4000/socket";

type TranscriptPayload = {
  message: string;
  user: string;
};

type UserTranscripts = {
  [username: string]: string;
};

type Props = {
  username: string;
  roomUrl: string;
};

function VideoChat({ username, roomUrl }: Props) {
  const [othersTranscripts, setOthersTranscripts] =
    React.useState<UserTranscripts>({});

  const {
    transcript: localTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const localMedia = useLocalMedia({ audio: true, video: true });
  const { localStream } = localMedia.state;

  const { state } = useRoomConnection(roomUrl, {
    displayName: username,
    localMedia,
  });
  const { remoteParticipants } = state;

  React.useEffect(() => {
    if (localStream && !listening && browserSupportsSpeechRecognition) {
      console.log("starting listening");
      SpeechRecognition.startListening({ continuous: true });
    }
  }, [localStream, listening]);

  const updateOthersTranscripts = (payload: TranscriptPayload) => {
    setOthersTranscripts((prev) => {
      return { ...prev, [payload.user]: payload.message };
    });
  };

  const { connected: channelConnected, sendMessage } =
    usePhoenixChannel<TranscriptPayload>({
      url: URL,
      topic: `chat:${roomUrl}`,
      onMessages: [
        {
          event: "new_message",
          callback: (payload) => {
            updateOthersTranscripts(payload);
          },
        },
      ],
      onChannelJoinError: (resp) => console.log("Unable to join", resp),
      onChannelJoinOk: (resp) => console.log("Joined successfully", resp),
    });

  React.useEffect(() => {
    console.log("sending message");
    if (listening) {
      sendMessage("send_message", { message: localTranscript, user: username });
    }
  }, [localTranscript]);

  return (
    <>
      <div>
        Transcript channel{" "}
        {channelConnected ? (
          <span className="rounded-full bg-green-800 px-3 py-1 text-white ring-green-950">
            connected
          </span>
        ) : (
          <span className="rounded-full bg-red-800 px-3 py-1 text-white ring-red-950">
            disconnected
          </span>
        )}
      </div>
      <h1 className="mb-6 text-2xl">Participants</h1>
      <div className="flex flex-col gap-2">
        {remoteParticipants.map((p) => (
          <div className="flex flex-row gap-2">
            <div>{p.displayName}</div>
            <div key={p.id} className="flex w-1/3 flex-col align-middle">
              {p.stream !== undefined ? (
                <VideoView stream={p.stream} />
              ) : (
                <div>no video stream</div>
              )}
            </div>
            {
              <div>
                {othersTranscripts[p.displayName] !== undefined
                  ? othersTranscripts[p.displayName]
                  : "[no transcript]"}
              </div>
            }
          </div>
        ))}
      </div>
      <div>My transcript: {localTranscript}</div>
    </>
  );
}

export default VideoChat;
