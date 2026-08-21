import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/nav/sidebar";

export const metadata: Metadata = {
  title: "Property Viewing Tracker",
  description: "Track client property viewings, status, and results.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen flex-col md:flex-row">
          <Sidebar />
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
