import dynamic from "next/dynamic";

// Load Dictaphone component only on the client side
const Dictaphone = dynamic(() => import("~/components/Dictaphone"), {
  ssr: false,
});

function MyComponent() {
  return (
    <div>
      <Dictaphone />
    </div>
  );
}

export default MyComponent;
