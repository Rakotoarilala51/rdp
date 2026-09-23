"use client";

import Link from "next/link";

import { Controls } from "../components/Controls";
import { EventLog } from "../components/EventLog";
import { PetriNet } from "../components/PetriNet";
import { StatePanel } from "../components/StatePanel";
import { usePetriSimulation } from "../hooks/usePetriSimulation";

export default function Home() {
  const simulation = usePetriSimulation();
  return <main><header><div><small>RÉSEAU DE PETRI · TOKEN RING</small><h1>Exécution du réseau</h1><Link href="/presentation" style={{ color: "var(--secondary)", display: "inline-block", marginBottom: 12 }}>Voir la présentation →</Link><p>4 postes · 9 places · 8 transitions · une base partagée</p></div><b>{simulation.isPlaying ? "● Lecture en cours" : "● Mode pas à pas"}</b></header><section className="layout"><PetriNet marking={simulation.marking} enabledId={simulation.enabledTransition?.id} flashing={simulation.flashing} flights={simulation.flights} duration={simulation.animationDuration}/><div><StatePanel marking={simulation.marking} previous={simulation.previous} next={simulation.enabledTransition?.id}/><EventLog entries={simulation.log}/></div></section><Controls onStep={simulation.step} onPlay={simulation.play} onPause={simulation.pause} onReset={simulation.reset} speed={simulation.speed} onSpeed={simulation.setSpeed} isPlaying={simulation.isPlaying}/></main>;
}
