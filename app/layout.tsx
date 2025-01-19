"use client";
// CSS
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="ar">
        <body
          className="pb-5"
        > 
          {children}
        </body>
      </html>
  );
}
