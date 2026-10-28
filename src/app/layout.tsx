import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata: Metadata = {
  title: "Elite Wedding",
  description: "India's most trusted matrimonial platform. 5 lakh+ verified profiles. Find your perfect life partner today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=Lato:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff8f0" }}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}