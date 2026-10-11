import type { Metadata } from "next";
import "./globals.css";
import Background from "@/components/Background";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Oppify",
  description: "opportunities....", //whats our catchphrase again OOPS
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans", inter.variable)}>
      <head>
        {/* Inject Google Icons Link Here */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0..1,0"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Background />
        {children}
      </body>
    </html>
  );
}
