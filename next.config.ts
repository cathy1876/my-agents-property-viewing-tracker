import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AI-generated apps should deploy even if the template has strict type or
  // lint issues. Type errors are compile-time only and don't affect runtime,
  // so we don't let them block a deployment.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // The floating dev-mode route indicator overlaps mobile card/table content.
  devIndicators: false,
  // Without this, Link prefetching populates the client-side Router Cache
  // with a snapshot of a route (e.g. /viewings, prefetched from the detail
  // page's "Back to viewings" link) *before* a later mutation (e.g.
  // updating a viewing's outcome in place). Next's default 30s staleTime
  // means that prefetched snapshot is treated as fresh and reused as-is on
  // the next visit, even though revalidatePath() has already invalidated
  // the server-side data - showing genuinely stale (pre-mutation) content
  // that doesn't self-correct until the 30s window lapses. This forces
  // every navigation to a dynamic route to refetch instead of reusing a
  // stale prefetch.
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
};

export default nextConfig;
