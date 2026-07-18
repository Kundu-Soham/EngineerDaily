import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Engineer Daily",
  description: "AI-powered daily news briefing for engineering professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Added max-w-4xl, mx-auto to center content, and px-6 to prevent edge-touching */}
      <body className="antialiased min-h-screen max-w-4xl mx-auto px-6 py-10 md:py-16">
        {children}
      </body>
    </html>
  );
}