import type { Metadata } from "next";
import { Presentation } from "./presentation";

export const metadata: Metadata = {
  title: "Présentation — Token Ring & réseaux de Petri",
  description: "Du fonctionnement d’un poste à la modélisation de quatre ordinateurs partageant une base de données.",
};

export default function Page() {
  return <Presentation />;
}
