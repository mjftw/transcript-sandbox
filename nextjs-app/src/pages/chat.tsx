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

  return {
    props: {
      phoenixSocketUrl: env.PHOENIX_WEBSOCKET_URL,
    },
  };
}) satisfies GetServerSideProps<{
  phoenixSocketUrl: string;
}>;

function MyComponent({
  phoenixSocketUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <Chat phoenixSocketUrl={phoenixSocketUrl} />
    </div>
  );
}

export default MyComponent;
