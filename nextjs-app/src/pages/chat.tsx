import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { env } from "process";

const Chat = dynamic(() => import("~/components/Chat"), {
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
  return (
    <div>
      <Chat
        phoenixSocketUrl={phoenixSocketUrl}
        phoenixSecretKey={phoenixSecretKey}
      />
    </div>
  );
}

export default Meeting;
