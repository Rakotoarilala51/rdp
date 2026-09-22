import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Réseau de Petri — Token Ring",
  description: "Simulation pédagogique d'un réseau de Petri Token Ring",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
