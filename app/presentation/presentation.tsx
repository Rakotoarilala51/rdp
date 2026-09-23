"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PetriNet } from "../../components/PetriNet";
import { INITIAL_MARKING } from "../../model/petriNet";
import styles from "./presentation.module.css";

const chapters = ["Page de titre", "Énoncé du sujet", "Un poste et une base", "Les quatre postes", "Les technologies"];

function SingleStation({ petri = false }: { petri?: boolean }) {
  return <svg viewBox="0 0 760 400" role="img" aria-label={petri ? "P11 et B alimentent D1 ; D1 produit P12 ; F1 libère B et transmet le jeton au poste suivant." : "Un poste détient le jeton et accède à une base partagée via le réseau global."} className={styles.diagram}>
    <defs><marker id={petri ? "petri-arrow" : "station-arrow"} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="currentColor" /></marker></defs>
    {petri ? <>
      <g fill="none" stroke="currentColor" strokeWidth="3" markerEnd="url(#petri-arrow)">
        <path d="M114 235H218"/><path d="M232 235H327"/><path d="M393 235H493"/><path d="M507 235H655"/><path d="M349 96L230 210"/><path d="M500 210L395 96"/>
      </g>
      <g fill="#ffffff" stroke="#2a3fe5" strokeWidth="2"><circle cx="80" cy="235" r="33"/><circle cx="360" cy="235" r="33"/><circle cx="375" cy="70" r="33"/></g>
      <g fill="#2a3fe5"><circle cx="80" cy="235" r="9"/><circle cx="375" cy="70" r="9"/><rect x="218" y="199" width="14" height="72"/><rect x="493" y="199" width="14" height="72"/></g>
      <g textAnchor="middle" fill="currentColor"><text x="80" y="300">P11 · jeton reçu</text><text x="225" y="175">D1</text><text x="360" y="300">P12 · traitement</text><text x="500" y="175">F1</text><text x="670" y="278">Poste suivant</text><text x="375" y="22">B · base libre</text><text x="375" y="365">D1 : acquérir le verrou → F1 : libérer et transmettre</text></g>
    </> : <>
      <rect x="60" y="125" width="195" height="133" rx="8" fill="#ffffff" stroke="#2a3fe5" strokeWidth="5"/><rect x="77" y="142" width="161" height="94" fill="#111827"/><path d="M157 259V286M103 286H212" stroke="currentColor" strokeWidth="8"/>
      <circle cx="158" cy="75" r="18" fill="#f4b9b0"/><text x="195" y="82" fill="currentColor">Jeton détenu</text>
      <path d="M280 195H510" stroke="currentColor" strokeWidth="3" markerEnd="url(#station-arrow)"/><text x="398" y="169" textAnchor="middle" fill="currentColor">Réseau global</text>
      <path d="M535 145V253C535 287 700 287 700 253V145" fill="#ffffff" stroke="#2a3fe5" strokeWidth="2"/><ellipse cx="617" cy="145" rx="82" ry="27" fill="#f4b9b0" stroke="#2a3fe5" strokeWidth="2"/><text x="617" y="221" textAnchor="middle" fill="#111827">Base partagée</text>
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
      <nav className={styles.sidebar} aria-label="Diapositives"><div className={styles.outlineTitle}>AU PROGRAMME</div>{chapters.map((chapter, i) => <button key={chapter} onClick={() => setIndex(i)} aria-current={index === i ? "step" : undefined}><span>{String(i + 1).padStart(2, "0")}</span>{chapter}</button>)}<div className={styles.sidebarNote}><span>ÉTUDE DE CAS</span><b>Token Ring</b><p>Coordonner les accès.<br/>Partager les ressources.</p><div>ENI · MASTER 1</div></div></nav>
      <section className={styles.stage} aria-roledescription="diaporama" aria-label="Présentation du système Token Ring">
        <article key={index} className={`${styles.slide} ${index === 0 ? styles.cover : ""}`} aria-roledescription="diapositive" aria-label={`${index + 1} sur ${chapters.length} : ${chapters[index]}`}>
          {index > 0 && <div className={styles.eyebrow}><b>{String(index).padStart(2, "0")}</b> <span> / {chapters[index]}</span></div>}
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
            <p>Soit un système informatique dont l’architecture est constituée de quatre ordinateurs reliés entre eux par un réseau local de type token ring (cf. schéma ci-dessous). Un poste donné ne peut effectuer des transferts réseau que s’il détient le jeton (token). Lorsque le poste de travail a terminé ces transferts, le jeton est transféré à l’ordinateur suivant sur l’anneau.</p>
            <p>Pour effectuer leurs traitements, les postes de travail accèdent à une base de données partagée, via un réseau global. Cette base de données est également accessible depuis d’autres points du réseau global. Chaque poste de travail doit donc la verrouiller lorsqu’il l’utilise, pour empêcher tout accès concurrent.</p>
            <p>Un ordinateur ne peut effectuer ses traitements que s’il dispose du jeton et que la base de données partagée est libre.</p>
            </div><figure><Image src="/illustration.png" alt="Schéma de l’énoncé : quatre postes en anneau Token Ring accédant à une base de données partagée." width={503} height={416} priority/><figcaption>Architecture du système : quatre postes et une base partagée.</figcaption></figure></div></>}
          {index === 2 && <><h1>Un seul poste.<br/><em>Une base de données.</em></h1><p className={styles.lead}>On modélise d’abord le poste 1 et la base B : recevoir le jeton, verrouiller, traiter, puis libérer. Ce fragment sera ensuite répété sur l’anneau.</p><div className={styles.diagramPanel}><div className={styles.panelLabel}><span>01 / MODÈLE ÉLÉMENTAIRE</span><span>Poste 1 + ressource B</span></div><SingleStation petri/></div><div className={styles.cards}><div><b>D1 / Début</b><p>Consomme les marques de P11 et B. Place une marque dans P12 : le poste traite, la base est verrouillée.</p></div><div><b>F1 / Fin</b><p>Consomme la marque de P12. Rend B disponible et transmet le jeton au poste suivant.</p></div></div><p className={styles.caption}>Cercles : places · Barres : transitions · Points : marques. La marque de B représente la disponibilité de la base, pas le jeton réseau.</p></>}
          {index === 3 && <><h1>Un anneau,<br/><em>une place B commune.</em></h1><div className={styles.modelGrid}><div className={styles.graphFrame}><PetriNet marking={INITIAL_MARKING} enabledId="D1" flashing={null} flights={[]} duration={500}/></div><div><div className={styles.metrics}><div><b>04</b><span>postes</span></div><div><b>09</b><span>places</span></div><div><b>08</b><span>transitions</span></div></div><ul><li>Pᵢ1 : le poste i détient le jeton, prêt à démarrer.</li><li>Pᵢ2 : le poste i est en traitement.</li><li>Dᵢ : acquérir la base et démarrer.</li><li>Fᵢ : libérer la base et transmettre le jeton.</li></ul><div className={styles.callout}>État initial : une marque dans P11 et une dans B. Les autres places sont vides.</div><p className={styles.caption}>Chaque Dᵢ consomme B ; chaque Fᵢ la restitue. Au plus un poste peut donc être en traitement.</p></div></div></>}
          {index === 4 && <><h1>Les technologies<br/><em>au service du modèle.</em></h1><p className={styles.lead}>De la logique des transitions à leur représentation visuelle.</p><div className={styles.techGrid}>{[
            { name: "Next.js", category: "FRAMEWORK", logo: "/next.svg", body: "Structure de l’application et navigation entre les pages." },
            { name: "React", category: "INTERFACE", logo: "/technologies/react.svg", body: "Composants interactifs et actualisation de l’état du réseau." },
            { name: "TypeScript", category: "LANGAGE", logo: "/technologies/typescript.svg", body: "Places, transitions et marquages décrits avec des types." },
            { name: "SVG", category: "SCHÉMAS", logo: "/technologies/svg.svg", body: "Graphes vectoriels et déplacement animé des jetons." },
            { name: "CSS", category: "MISE EN FORME", logo: "/technologies/css.svg", body: "Composition des diapositives, styles et transitions visuelles." },
          ].map(tech => <div className={styles.techCard} key={tech.name}><div className={styles.techLogo}><Image src={tech.logo} alt={`Logo ${tech.name}`} width={80} height={64}/></div><span className={styles.techCategory}>{tech.category}</span><h2>{tech.name}</h2><p>{tech.body}</p></div>)}</div><div className={styles.method}><span>LE FIL CONDUCTEUR</span><p>Modéliser avec les réseaux de Petri. Comprendre grâce à la visualisation.</p></div></>}
        </article>
        <div className={styles.controls}><button onClick={() => move(-1)} disabled={index === 0} aria-label="Diapositive précédente">← Précédente</button><div><span aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}</span><span className={styles.shortcut}>Flèches ← → ou espace</span></div><button onClick={() => move(1)} disabled={index === chapters.length - 1} aria-label="Diapositive suivante">Suivante →</button></div>
        <div className={styles.progress} role="progressbar" aria-label="Progression de la présentation" aria-valuemin={1} aria-valuemax={chapters.length} aria-valuenow={index + 1}><div style={{ width: `${((index + 1) / chapters.length) * 100}%` }}/></div>
      </section>
    </div><div role="status" className={styles.status}>{message}</div>
  </div>;
}
