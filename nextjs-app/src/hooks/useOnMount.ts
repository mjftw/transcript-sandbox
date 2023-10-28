import { useEffect, useState } from "react";

export default function useOnMount(callback: () => void) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      callback();
      setMounted(true);
    }
  }, [mounted]);
}
