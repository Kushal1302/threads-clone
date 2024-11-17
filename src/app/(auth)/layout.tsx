import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-dark-1`}>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
