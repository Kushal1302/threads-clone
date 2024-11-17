import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import "../globals.css";
import localFont from "next/font/local";
const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark-1`}
      >
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
