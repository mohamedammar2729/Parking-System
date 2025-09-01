import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../providers/all-provider";
import { WebSocketStatus } from "@/components/connection-status";

export const metadata: Metadata = {
  title: "Parking Reservation System",
  description: "Parking reservation system with real-time updates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          <div className='fixed top-5 right-6 z-50'>
           
          </div>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
