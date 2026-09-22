"use client";
import { useEffect, useRef, useState } from "react";
import {
  INITIAL_MARKING,
  PLACE_IDS,
  TRANSITIONS,
  enabled,
  fire,
  type Marking,
} from "../model/petriNet";
const pos: Record<string, [number, number]> = {
  P11: [180, 95],
  D1: [290, 95],
  P12: [400, 95],
  F1: [510, 95],
  P21: [660, 155],
  D2: [660, 255],
  P22: [660, 355],
  F2: [660, 455],
  P31: [510, 560],
  D3: [400, 560],
  P32: [290, 560],
  F3: [180, 560],
  P41: [90, 455],
  D4: [90, 355],
  P42: [90, 255],
  F4: [90, 155],
  B: [375, 330],
};
const arcs = TRANSITIONS.flatMap((t) => [
  ...t.inputs.map((a) => [a, t.id]),
  ...t.outputs.map((b) => [t.id, b]),
]);
function path(a: string, b: string) {
  const [x, y] = pos[a],
    [X, Y] = pos[b],
    d = Math.hypot(X - x, Y - y),
    s = a === "B" || a[0] === "P" ? 27 : 8,
    e = b === "B" || b[0] === "P" ? 30 : 8;
  return `M${x + ((X - x) / d) * s},${y + ((Y - y) / d) * s} L${X - ((X - x) / d) * e},${Y - ((Y - y) / d) * e}`;
}
export default function Home() {
  const [m, setM] = useState<Marking>(INITIAL_MARKING),
    [last, setLast] = useState("—"),
    [moving, setMoving] = useState<[string, string][]>([]),
    [flash, setFlash] = useState(""),
    [speed, setSpeed] = useState(1),
    [auto, setAuto] = useState(false),
    [log, setLog] = useState([
      "État initial : Poste 1 possède le jeton, BD libre.",
    ]),
    ref = useRef(m),
    busy = useRef(false);
  useEffect(() => {
    ref.current = m;
  }, [m]);
  const d = () => 520 / speed;
  const step = () => {
    const t = enabled(ref.current);
    if (!t || busy.current) return;
    busy.current = true;
    setMoving(t.inputs.map((a) => [a, t.id]));
    setTimeout(() => {
      setMoving([]);
      setFlash(t.id);
      setTimeout(() => {
        setFlash("");
        setMoving(t.outputs.map((b) => [t.id, b]));
        setTimeout(() => {
          setMoving([]);
          setM(fire(t, ref.current));
          setLast(t.id);
          setLog((x) => [...x, `${t.id} : ${t.description}`].slice(-7));
          busy.current = false;
        }, d());
      }, 240 / speed);
    }, d());
  };
  useEffect(() => {
    if (!auto) return;
    const i = setInterval(step, 1450 / speed);
    return () => clearInterval(i);
  }, [auto, speed]);
  const next = enabled(m),
    owner = PLACE_IDS.find((x) => x !== "B" && m[x]);
  return (
    <main>
      <header>
        <div>
          <small>RÉSEAU DE PETRI · TOKEN RING</small>
          <h1>Exécution du réseau</h1>
          <p>4 postes · 9 places · 8 transitions · une base partagée</p>
        </div>
        <b>{auto ? "● Lecture en cours" : "● Mode pas à pas"}</b>
      </header>
      <section className="layout">
        <div className="card graph">
          <h2>Graphe du réseau</h2>
          <p className="hint">Les transitions vertes sont franchissables.</p>
          <svg viewBox="0 0 750 660">
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M0,0L10,5L0,10z" />
              </marker>
            </defs>
            <rect x="105" y="30" width="440" height="130" />
            <rect x="590" y="90" width="125" height="420" />
            <rect x="105" y="495" width="440" height="130" />
            <rect x="25" y="90" width="125" height="420" />
            <text x="325" y="55">
              POSTE DE TRAVAIL 1
            </text>
            <text x="680" y="300" transform="rotate(90 680 300)">
              POSTE DE TRAVAIL 2
            </text>
            <text x="325" y="610">
              POSTE DE TRAVAIL 3
            </text>
            <text x="60" y="300" transform="rotate(-90 60 300)">
              POSTE DE TRAVAIL 4
            </text>
            {arcs.map(([a, b]) => (
              <path
                key={a + b}
                className="arc"
                d={path(a, b)}
                markerEnd="url(#arrow)"
              />
            ))}
            {PLACE_IDS.map((id) => {
              const [x, y] = pos[id];
              return (
                <g key={id}>
                  <circle
                    className={m[id] ? "place full" : "place"}
                    cx={x}
                    cy={y}
                    r="27"
                  />
                  {m[id] > 0 && (
                    <circle className="token" cx={x} cy={y} r="8" />
                  )}
                  <text className="id" x={x} y={y + 47}>
                    {id}
                  </text>
                </g>
              );
            })}
            {TRANSITIONS.map((t) => {
              const [x, y] = pos[t.id],
                v = /[24]$/.test(t.id);
              return (
                <g key={t.id}>
                  <rect
                    className={`transition ${next?.id === t.id ? "on" : ""} ${flash === t.id ? "blink" : ""}`}
                    x={v ? x - 30 : x - 6}
                    y={v ? y - 6 : y - 30}
                    width={v ? 60 : 12}
                    height={v ? 12 : 60}
                  />
                  <text className="tid" x={v ? x : x + 18} y={v ? y - 16 : y}>
                    {t.id}
                  </text>
                </g>
              );
            })}
            <text className="base" x="375" y="385">
              BASE DE DONNÉES
            </text>
            <text className="base sub" x="375" y="402">
              {m.B ? "libre" : "verrouillée"}
            </text>
            {moving.map(([a, b], i) => (
              <circle className="fly" r="8" key={i}>
                <animateMotion dur={`${d()}ms`} path={path(a, b)} />
              </circle>
            ))}
          </svg>
        </div>
        <aside>
          <div className="card">
            <small>ÉTAT DU RÉSEAU</small>
            <h2>Marquage courant</h2>
            <div className="marks">
              {PLACE_IDS.map((x) => (
                <span key={x}>
                  {x}
                  <b className={m[x] ? "yes" : ""}>{m[x]}</b>
                </span>
              ))}
            </div>
          </div>
          <div className="card info">
            <p>
              Transition précédente <b>{last}</b>
            </p>
            <p>
              Suivante activée <b className="green">{next?.id}</b>
            </p>
            <p>
              Token Ring <b>{owner ? `Poste ${owner[1]}` : "en traitement"}</b>
            </p>
            <p>
              Base de données{" "}
              <b className={m.B ? "green" : "orange"}>
                {m.B ? "Libre" : "Verrouillée"}
              </b>
            </p>
          </div>
          <div className="card journal">
            <small>JOURNAL D’EXÉCUTION</small>
            {log.map((x, i) => (
              <p key={i}>
                {i + 1}. {x}
              </p>
            ))}
          </div>
        </aside>
      </section>
      <footer>
        <button className="primary" onClick={step}>
          Étape suivante →
        </button>
        <button onClick={() => setAuto(true)}>Lecture automatique</button>
        <button onClick={() => setAuto(false)}>Pause</button>
        <button
          onClick={() => {
            if (!busy.current) {
              setAuto(false);
              setM(INITIAL_MARKING);
              setLast("—");
              setLog(["État initial : Poste 1 possède le jeton, BD libre."]);
            }
          }}
        >
          ↺ Réinitialiser
        </button>
        <label>
          Vitesse{" "}
          {[0.5, 1, 2].map((x) => (
            <button
              key={x}
              className={x === speed ? "sel" : ""}
              onClick={() => setSpeed(x)}
            >
              {x}x
            </button>
          ))}
        </label>
      </footer>
    </main>
  );
}
