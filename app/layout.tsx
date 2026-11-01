import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Green Diwali — Khushiyan, bina dhuein ke",
  description: "Celebrate a brighter Diwali with a joyful, safe digital celebration. Add your light to the global counter.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
