"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/viewings", label: "Viewings" },
  { href: "/clients", label: "Clients" },
  { href: "/properties", label: "Properties" },
  { href: "/agents", label: "Agents" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map((link) => {
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

export function Sidebar() {
  const [open, setOpen] = useState(false);

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
        <div className="border-b border-neutral-200 px-4 py-3 md:hidden">
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      )}
      <aside className="hidden md:flex md:w-56 md:flex-col md:border-r md:border-neutral-200 md:px-4 md:py-6">
        <span className="mb-6 px-3 text-lg font-semibold">Viewing Tracker</span>
        <NavLinks />
      </aside>
    </>
  );
}
