import './globals.css'

export const metadata = {
  title: "App de Recetas",
  description: "Tu colección de recetas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}