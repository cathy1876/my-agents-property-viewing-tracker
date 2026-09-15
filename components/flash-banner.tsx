"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function FlashBanner({
  param,
  pathname,
  messages,
}: {
  param: string | undefined;
  pathname: string;
  messages: Record<string, string>;
}) {
  const router = useRouter();
  const [message] = useState(param ? messages[param] : undefined);

  useEffect(() => {
    if (param) {
      router.replace(pathname, { scroll: false });
    }
    // Only strip on the initial mount for this param - not on every
    // pathname/param identity change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!message) return null;

  return (
    <div className="mb-6 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
      {message}
    </div>
  );
}
