import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "App de Recetas",
  description: "Encuentra y comparte recetas deliciosas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-orange-50 min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}