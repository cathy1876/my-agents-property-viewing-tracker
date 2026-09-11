"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/lib/actions/auth";
import type { SessionProfile } from "@/lib/auth/session";

const BASE_LINKS = [
  { href: "/viewings", label: "Viewings" },
  { href: "/clients", label: "Clients" },
  { href: "/properties", label: "Properties" },
  { href: "/agents", label: "Agents" },
];
const ADMIN_ONLY_LINKS = [{ href: "/admin/accounts", label: "Manage Accounts" }];

function NavLinks({
  profile,
  onNavigate,
}: {
  profile: SessionProfile;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  // Agents get no view of the Agents section at all - not even their own
  // record via a list - since a list of "just me" implies others exist.
  const links = [
    ...BASE_LINKS.filter((l) => !(l.href === "/agents" && profile.role === "agent")),
    ...(profile.role === "admin" ? ADMIN_ONLY_LINKS : []),
  ];
  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const active = pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-neutral-900 text-white"
                : "text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AccountFooter({ profile }: { profile: SessionProfile }) {
  return (
    <div className="mt-auto flex flex-col gap-2 border-t border-neutral-200 pt-4 text-sm">
      <div className="truncate text-neutral-500">
        {profile.email}
        <span className="ml-1 capitalize">({profile.role})</span>
      </div>
      <form action={logoutAction}>
        <button
          type="submit"
          className="font-medium text-neutral-700 hover:text-neutral-900"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}

export function Sidebar({ profile }: { profile: SessionProfile | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/login" || !profile) return null;

  return (
    <>
      <header className="relative z-20 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
        <span className="text-lg font-semibold">Viewing Tracker</span>
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-neutral-300 p-2"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 5h14M3 10h14M3 15h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>
      {open && (
        <div className="flex flex-col border-b border-neutral-200 px-4 py-3 md:hidden">
          <NavLinks profile={profile} onNavigate={() => setOpen(false)} />
          <AccountFooter profile={profile} />
        </div>
      )}
      <aside className="hidden md:flex md:w-56 md:flex-col md:border-r md:border-neutral-200 md:px-4 md:py-6">
        <span className="mb-6 px-3 text-lg font-semibold">Viewing Tracker</span>
        <NavLinks profile={profile} />
        <AccountFooter profile={profile} />
      </aside>
    </>
  );
}
