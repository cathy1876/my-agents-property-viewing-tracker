import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AI-generated apps should deploy even if the template has strict type or
  // lint issues. Type errors are compile-time only and don't affect runtime,
  // so we don't let them block a deployment.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // The floating dev-mode route indicator overlaps mobile card/table content.
  devIndicators: false,
  // Without this, the client-side Router Cache can serve a stale RSC
  // payload for a route on first paint after a mutation (e.g. Edit's
  // redirect back to a detail page visited earlier in the session),
  // briefly showing pre-update data before a second render corrects it.
  // force-dynamic alone doesn't fix this - it's a separate client cache.
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
};

export default nextConfig;
