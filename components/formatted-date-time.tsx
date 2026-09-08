"use client";

import { useEffect, useState } from "react";

type DateTimeStyle = "full" | "long" | "medium" | "short";

// Renders in the viewer's real local timezone. Server Components can't
// know that (they'd format using whatever timezone the server itself runs
// in), so this has to be a Client Component. It starts blank - both the
// server's HTML and the client's first paint before mount render nothing,
// so they match exactly (no hydration mismatch) - then useEffect fills in
// the correctly localized text once mounted. It deliberately does NOT fall
// back to a UTC-rendered guess first: for a UTC+8 visitor, "18:30" briefly
// rendered as "10:30" before correcting reads as stale/wrong data (an
// 8-hour-old value flashing on screen), not a loading state.
export function FormattedDateTime({
  iso,
  dateStyle,
  timeStyle,
}: {
  iso: string;
  dateStyle: DateTimeStyle;
  timeStyle: DateTimeStyle;
}) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    setText(new Date(iso).toLocaleString("en-ZA", { dateStyle, timeStyle }));
  }, [iso, dateStyle, timeStyle]);

  return <>{text ?? "…"}</>;
}
