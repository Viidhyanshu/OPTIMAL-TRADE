import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OPTIMAL TRADE | Algorithmic Execution Strategy Platform",
  description: "Institutional trade execution slicing, market microstructure simulation, Almgren-Chriss optimization, and dynamic regime shift shock adaptation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">{children}</body>
    </html>
  );
}
