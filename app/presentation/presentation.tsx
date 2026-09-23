"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PetriNet } from "../../components/PetriNet";
import { INITIAL_MARKING } from "../../model/petriNet";
import styles from "./presentation.module.css";

const chapters = ["Page de titre", "Énoncé du sujet", "Un poste et une base", "Les quatre postes", "Conditions de départ", "Les technologies", "Les accès externes", "La démonstration"];

function SingleStation({ petri = false }: { petri?: boolean }) {
  return <svg viewBox="0 0 760 400" role="img" aria-label={petri ? "P11 et B alimentent D1 ; D1 produit P12 ; F1 libère B et transmet le jeton au poste suivant." : "Un poste détient le jeton et accède à une base partagée via le réseau global."} className={styles.diagram}>
    <defs><marker id={petri ? "petri-arrow" : "station-arrow"} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="currentColor" /></marker></defs>
    {petri ? <>
      <g fill="none" stroke="currentColor" strokeWidth="3" markerEnd="url(#petri-arrow)">
        <path d="M114 235H218"/><path d="M232 235H327"/><path d="M393 235H493"/><path d="M507 235H655"/><path d="M349 96L230 210"/><path d="M500 210L395 96"/>
      </g>
      <g fill="#fffdf5" stroke="#2a3fe5" strokeWidth="4"><circle cx="80" cy="235" r="33"/><circle cx="360" cy="235" r="33"/><circle cx="375" cy="70" r="33"/></g>
      <g fill="#2a3fe5"><circle cx="80" cy="235" r="9"/><circle cx="375" cy="70" r="9"/><rect x="218" y="199" width="14" height="72"/><rect x="493" y="199" width="14" height="72"/></g>
      <g textAnchor="middle" fill="currentColor"><text x="80" y="300">P11 · jeton reçu</text><text x="225" y="175">D1</text><text x="360" y="300">P12 · traitement</text><text x="500" y="175">F1</text><text x="670" y="278">Poste suivant</text><text x="375" y="22">B · base libre</text><text x="375" y="365">D1 : acquérir le verrou → F1 : libérer et transmettre</text></g>
    </> : <>
      <rect x="60" y="125" width="195" height="133" rx="8" fill="#fffdf5" stroke="#2a3fe5" strokeWidth="5"/><rect x="77" y="142" width="161" height="94" fill="#111827"/><path d="M157 259V286M103 286H212" stroke="currentColor" strokeWidth="8"/>
      <circle cx="158" cy="75" r="18" fill="#f4b9b0"/><text x="195" y="82" fill="currentColor">Jeton détenu</text>
      <path d="M280 195H510" stroke="currentColor" strokeWidth="3" markerEnd="url(#station-arrow)"/><text x="398" y="169" textAnchor="middle" fill="currentColor">Réseau global</text>
      <path d="M535 145V253C535 287 700 287 700 253V145" fill="#fffdf5" stroke="#2a3fe5" strokeWidth="4"/><ellipse cx="617" cy="145" rx="82" ry="27" fill="#f4b9b0" stroke="#2a3fe5" strokeWidth="4"/><text x="617" y="221" textAnchor="middle" fill="#111827">Base partagée</text>
      <text x="158" y="330" textAnchor="middle" fill="currentColor">Poste 1</text><text x="618" y="330" textAnchor="middle" fill="currentColor">Verrou obligatoire</text>
    </>}
  </svg>;
}

export function Presentation() {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [message, setMessage] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const move = (delta: number) => setIndex(current => Math.max(0, Math.min(chapters.length - 1, current + delta)));

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || (event.target instanceof HTMLElement && event.target.closest("button, a, input, textarea, select, [contenteditable]"))) return;
      if (["ArrowRight", "PageDown", " ", "ArrowLeft", "PageUp", "Home", "End"].includes(event.key)) event.preventDefault();
      if (["ArrowRight", "PageDown", " "].includes(event.key)) move(1);
      if (["ArrowLeft", "PageUp"].includes(event.key)) move(-1);
      if (event.key === "Home") setIndex(0);
      if (event.key === "End") setIndex(chapters.length - 1);
    };
    const syncFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    window.addEventListener("keydown", keydown);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => { window.removeEventListener("keydown", keydown); document.removeEventListener("fullscreenchange", syncFullscreen); };
  }, []);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (root.current?.requestFullscreen) await root.current.requestFullscreen();
      else setMessage("Le plein écran n’est pas disponible dans ce navigateur.");
    } catch { setMessage("Le navigateur n’a pas autorisé le plein écran."); }
  }

  return <div ref={root} className={styles.deck}>
    <div className={styles.topbar}><Link href="/">← Simulation</Link><span>RÉSEAUX DE PETRI / TOKEN RING</span><button onClick={toggleFullscreen}>{fullscreen ? "Quitter le plein écran" : "Plein écran ↗"}</button></div>
    <div className={styles.workspace}>
      <nav className={styles.sidebar} aria-label="Diapositives"><div className={styles.outlineTitle}>AU PROGRAMME</div>{chapters.map((chapter, i) => <button key={chapter} onClick={() => setIndex(i)} aria-current={index === i ? "step" : undefined}><span>{String(i + 1).padStart(2, "0")}</span>{chapter}</button>)}<div className={styles.sidebarNote}>4 ordinateurs.<br/>1 jeton.<br/>1 ressource partagée.</div></nav>
      <section className={styles.stage} aria-roledescription="diaporama" aria-label="Présentation du système Token Ring">
        <article key={index} className={`${styles.slide} ${index === 0 ? styles.cover : ""}`} aria-roledescription="diapositive" aria-label={`${index + 1} sur ${chapters.length} : ${chapters[index]}`}>
          {index > 0 && <div className={styles.eyebrow}>CHAPITRE {String(index).padStart(2, "0")} <span> / {chapters[index]}</span></div>}
          {index === 0 && <>
            <div className={styles.institution}>
              <Image className={styles.logo} src="/logoUF.webp" alt="Logo de l’Université de Fianarantsoa" width={110} height={110} priority />
              <div><p className={styles.university}>UNIVERSITÉ DE FIANARANTSOA</p><p className={styles.school}>École Nationale d’Informatique</p></div>
              <Image className={styles.logo} src="/logo%20eni.png" alt="Logo de l’École Nationale d’Informatique" width={110} height={110} priority />
            </div>
            <div className={styles.course}><p><strong>Niveau :</strong> M1</p><p><strong>Parcours :</strong> Informatique Générale</p><p className={styles.unit}><strong>Unité d’enseignement :</strong> Réseaux de Petri</p></div>
            <div className={styles.coverTitle}><span>MODÉLISATION & SYNCHRONISATION</span><h1>Modélisation d’un réseau Token Ring<br/><em>par les réseaux de Petri</em></h1><p>Accès exclusif à une base de données partagée</p></div>
            <div className={styles.presenters}><p>Présenté par :</p><p><strong>1697H-F</strong> ANDRIATAHIANA Tolojanahary Stephan</p><p><strong>1680H-F</strong> RAKOTOARILALA Andriniaina Pierre Innocent</p></div>
          </>}
          {index === 1 && <><h1>Énoncé du sujet</h1><div className={styles.subjectGrid}><div className={styles.subjectText}>
            <p>Soit un système informatique dont l’architecture est constituée de quatre ordinateur reliés entre eux par un réseau local de type token ring (cf. schéma ci-dessous). Un poste donné ne peut effectuer des transferts réseau que s’il détient le jeton (token). Lorsque le poste de travail a terminé ces transferts, le jeton est transféré à l’ordinateur suivant sur l’anneau.</p>
            <p>Pour effectuer leurs traitements, les postes de travail accèdent à une base de données partagée, via un réseau global. Cette base de données est également accessible depuis d’autres points du réseau global. Chaque poste de travail doit donc la verrouiller lorsqu’il l’utilise, pour empêcher tout accès concurrent.</p>
            <p>Un ordinateur ne peut effectuer ses traitements que s’il dispose du jeton et que la base de données partagée est libre.</p>
            </div><figure><Image src="/illustration.png" alt="Schéma de l’énoncé : quatre postes en anneau Token Ring accédant à une base de données partagée." width={503} height={416} priority/><figcaption>Architecture du système : quatre postes et une base partagée.</figcaption></figure></div></>}
          {index === 2 && <><h1>Un seul poste.<br/><em>Une base de données.</em></h1><p className={styles.lead}>On modélise d’abord le poste 1 et la base B : recevoir le jeton, verrouiller, traiter, puis libérer. Ce fragment sera ensuite répété sur l’anneau.</p><SingleStation petri/><div className={styles.cards}><div><b>D1 / Début</b><p>Consomme les marques de P11 et B. Place une marque dans P12 : le poste traite, la base est verrouillée.</p></div><div><b>F1 / Fin</b><p>Consomme la marque de P12. Rend B disponible et transmet le jeton au poste suivant.</p></div></div><p className={styles.caption}>Cercles : places · Barres : transitions · Points : marques. La marque de B représente la disponibilité de la base, pas le jeton réseau.</p></>}
          {index === 3 && <><h1>Un anneau,<br/><em>une place B commune.</em></h1><div className={styles.modelGrid}><div className={styles.graphFrame}><PetriNet marking={INITIAL_MARKING} enabledId="D1" flashing={null} flights={[]} duration={500}/></div><div><p className={styles.lead}>9 places · 8 transitions</p><ul><li>Pᵢ1 : le poste i détient le jeton, prêt à démarrer.</li><li>Pᵢ2 : le poste i est en traitement.</li><li>Dᵢ : acquérir la base et démarrer.</li><li>Fᵢ : libérer la base et transmettre le jeton.</li></ul><div className={styles.callout}>État initial : une marque dans P11 et une dans B. Les autres places sont vides.</div><p className={styles.caption}>Chaque Dᵢ consomme B ; chaque Fᵢ la restitue. Au plus un poste peut donc être en traitement.</p></div></div></>}
          {index === 4 && <><h1>Deux conditions.<br/><em>Un départ possible.</em></h1><div className={styles.equation}><span>Jeton détenu</span><strong>ET</strong><span>Base libre</span><strong>→</strong><span>Traitement</span></div><div className={styles.tableWrap}><table><thead><tr><th>Jeton détenu</th><th>Base libre</th><th>Décision</th></tr></thead><tbody><tr><td>Non</td><td>Non</td><td>Attendre</td></tr><tr><td>Non</td><td>Oui</td><td>Attendre le jeton</td></tr><tr><td>Oui</td><td>Non</td><td>Conserver le jeton et attendre</td></tr><tr><td>Oui</td><td>Oui</td><td>Verrouiller puis traiter</td></tr></tbody></table></div><p className={styles.caption}>L’acquisition du verrou est atomique : deux utilisateurs ne peuvent pas l’obtenir simultanément.</p></>}
          {index === 5 && <><h1>Les outils<br/><em>de la démonstration.</em></h1><p className={styles.lead}>Un modèle formel pour raisonner. Une application web pour observer son exécution.</p><div className={styles.techGrid}>{[["Next.js", "Structure de l’application et pages de présentation."], ["React", "Diapositives interactives et mise à jour de la simulation."], ["TypeScript", "Description typée des places, transitions et marquages."], ["SVG + CSS", "Schémas vectoriels, animations des jetons et interface arcade."]].map(([title, body]) => <div key={title}><b>{title}</b><p>{body}</p></div>)}</div><div className={styles.callout}>Méthode : un réseau de Petri représente les ressources disponibles et les événements autorisés.</div></>}
          {index === 6 && <><h1>Et si la base<br/><em>est déjà occupée ?</em></h1><p className={styles.lead}>L’énoncé prévoit aussi des accès depuis d’autres points du réseau global.</p><div className={styles.flow}><div><b>B</b><span>Base libre</span></div><span>→ Prise externe →</span><div><b>E</b><span>Usage externe</span></div><span>→ Libération →</span><div><b>B</b><span>Base libre</span></div></div><div className={styles.cards}><div><b>Étendre le modèle</b><p>Ajouter une place E et deux transitions : B → E pour prendre le verrou, E → B pour le rendre.</p></div><div><b>Effet sur l’anneau</b><p>Sans marque dans B, aucun Dᵢ ne peut partir. Le détenteur du jeton attend la libération de la base.</p></div></div><div className={styles.callout}>Périmètre actuel : la simulation montre les quatre postes. Cette extension externe est expliquée ici, mais n’y est pas encore implémentée.</div><p className={styles.caption}>L’exclusion mutuelle est assurée par B. La progression suppose que les traitements terminent et que les accès externes finissent par rendre la base disponible.</p></>}
          {index === 7 && <><h1>Du modèle<br/><em>à l’exécution.</em></h1><p className={styles.lead}>Suivre un tour complet et vérifier les règles à chaque transition.</p><div className={styles.sequence}>D1 → F1 → D2 → F2 → D3 → F3 → D4 → F4</div><div className={styles.cards}><div><b>À observer</b><p>La base se verrouille au début du traitement et se libère à la fin. Le jeton circule dans l’ordre de l’anneau.</p></div><div><b>À vérifier</b><p>Jamais deux postes en traitement. Après huit transitions, le système retrouve son marquage initial.</p></div></div><Link className={styles.launch} href="/">Lancer la simulation ↗</Link><p className={styles.caption}>Utiliser le mode pas à pas, puis la lecture automatique pour observer le cycle.</p></>}
        </article>
        <div className={styles.controls}><button onClick={() => move(-1)} disabled={index === 0} aria-label="Diapositive précédente">← Précédente</button><div><span aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}</span><span className={styles.shortcut}>Flèches ← → ou espace</span></div><button onClick={() => move(1)} disabled={index === chapters.length - 1} aria-label="Diapositive suivante">Suivante →</button></div>
        <div className={styles.progress} role="progressbar" aria-label="Progression de la présentation" aria-valuemin={1} aria-valuemax={chapters.length} aria-valuenow={index + 1}><div style={{ width: `${((index + 1) / chapters.length) * 100}%` }}/></div>
      </section>
    </div><div role="status" className={styles.status}>{message}</div>
  </div>;
}
