import {ThemeProvider} from "@/components/providers/theme-provider";
import {cn} from "@/lib/utils";
import type {Metadata} from "next";
import "./globals.css";

import Nav from "@/components/navigation/nav";
import React from "react";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={cn("px-6 md:px-12")}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Nav/>
      {children}
    </ThemeProvider>
    </body>
    </html>
  );
}
