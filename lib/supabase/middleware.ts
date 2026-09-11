import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase isn't configured, skip the auth refresh and pass through.
  // Without this guard createServerClient throws "Your project's URL and Key
  // are required", crashing the edge middleware on every route (500
  // MIDDLEWARE_INVOCATION_FAILED).
  if (!url || !anonKey) {
    return supabaseResponse;
  }

  try {
    let response = supabaseResponse;
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    // Refresh session so it doesn't expire while user is active
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;
    const isLoginRoute = pathname === "/login";

    if (!user) {
      if (isLoginRoute) return response;
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // A valid Supabase Auth session isn't enough on its own - it also
    // needs a profiles row (linked by an admin) and, for an agent, an
    // active agents row. This re-checks on every request (not just at
    // login) so an account deactivated mid-session loses access on its
    // very next request, not just its next login attempt.
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    let blocked = !profile;
    if (profile?.role === "agent") {
      const { data: agent } = await supabase
        .from("agents")
        .select("is_active")
        .eq("user_id", user.id)
        .maybeSingle();
      blocked = !agent || !agent.is_active;
    }

    if (blocked) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        new URL("/login?blocked=1", request.url),
      );
    }

    if (isLoginRoute) {
      return NextResponse.redirect(new URL("/viewings", request.url));
    }
    return response;
  } catch {
    // Never let an auth hiccup crash the entire edge middleware
    return supabaseResponse;
  }
}
