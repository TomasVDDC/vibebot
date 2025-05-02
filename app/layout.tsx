import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
// import { Montserrat } from "next/font/google";
import "./globals.css";

// const DMSans = Montserrat({
//   variable: "--font-dm-sans",
//   subsets: ["latin"],
//   weight: "800",
// });

export const metadata: Metadata = {
  title: "Vibebot",
  description: "Vibebot is a platform for building and managing your own telegram bots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body> {children} </body>
        {/* <body className={`${DMSans.variable} antialiased`}>{children}</body> */}
      </html>
    </ClerkProvider>
  );
}
