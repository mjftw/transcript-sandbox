import dynamic from "next/dynamic";

// Load Dictaphone component only on the client side
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
