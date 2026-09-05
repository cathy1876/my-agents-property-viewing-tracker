"use client";

import { useEffect, useState } from "react";

type DateTimeStyle = "full" | "long" | "medium" | "short";

// Renders in the viewer's real local timezone. Server Components can't
// know that (they'd format using whatever timezone the server itself runs
// in), so this has to be a Client Component. The initial render (both the
// server's HTML and the client's first paint, before mount) uses UTC
// explicitly so they match exactly - no hydration mismatch - then
// useEffect swaps in the correct local-timezone text once mounted.
export function FormattedDateTime({
  iso,
  dateStyle,
  timeStyle,
}: {
  iso: string;
  dateStyle: DateTimeStyle;
  timeStyle: DateTimeStyle;
}) {
  const utcFallback = new Date(iso).toLocaleString("en-ZA", {
    dateStyle,
    timeStyle,
    timeZone: "UTC",
  });
  const [text, setText] = useState(utcFallback);

  useEffect(() => {
    setText(new Date(iso).toLocaleString("en-ZA", { dateStyle, timeStyle }));
  }, [iso, dateStyle, timeStyle]);

  return <>{text}</>;
}
