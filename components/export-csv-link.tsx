"use client";

import { useEffect, useState } from "react";

// A plain server-rendered <a> can't know the visitor's real timezone - only
// the browser does. This appends it as a query param so the export route
// (which runs entirely server-side, with no client hydration step to defer
// formatting to) can render dates in the visitor's actual local time.
export function ExportCsvLink({ baseHref }: { baseHref: string }) {
  const [href, setHref] = useState(baseHref);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const url = new URL(baseHref, window.location.origin);
    url.searchParams.set("tz", tz);
    setHref(url.pathname + url.search);
  }, [baseHref]);

  return (
    <a
      href={href}
      className="inline-flex items-center rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
    >
      Export CSV
    </a>
  );
}
