import dynamic from "next/dynamic";

const Chat = dynamic(() => import("~/components/Chat"), {
  ssr: false,
});

function MyComponent() {
  return (
    <div>
      <Chat />
    </div>
  );
}

export default MyComponent;
