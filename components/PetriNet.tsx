import { ARCS, arcPath, NODE_POSITIONS, PLACE_IDS } from "../model/graph";
import {
  TRANSITIONS,
  type Marking,
  type TransitionId,
} from "../model/petriNet";
import type { Flight } from "../hooks/usePetriSimulation";
type Props = {
  marking: Marking;
  enabledId?: string;
  flashing: TransitionId | null;
  flights: Flight[];
  duration: number;
};
export function PetriNet({
  marking,
  enabledId,
  flashing,
  flights,
  duration,
}: Props) {
  return (
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
        {ARCS.map(({ from, to }) => (
          <path
            key={`${from}-${to}`}
            className="arc"
            d={arcPath(from, to)}
            markerEnd="url(#arrow)"
          />
        ))}
        {PLACE_IDS.map((id) => {
          const [x, y] = NODE_POSITIONS[id];
          return (
            <g key={id}>
              <circle
                className={marking[id] ? "place full" : "place"}
                cx={x}
                cy={y}
                r="27"
              />
              {marking[id] > 0 && (
                <circle className="token" cx={x} cy={y} r="8" />
              )}
              <text className="id" x={x} y={y + 47}>
                {id}
              </text>
            </g>
          );
        })}
        {TRANSITIONS.map((t) => {
          const [x, y] = NODE_POSITIONS[t.id],
            vertical = /[24]$/.test(t.id);
          return (
            <g key={t.id}>
              <rect
                className={`transition ${enabledId === t.id ? "on" : ""} ${flashing === t.id ? "blink" : ""}`}
                x={vertical ? x - 30 : x - 6}
                y={vertical ? y - 6 : y - 30}
                width={vertical ? 60 : 12}
                height={vertical ? 12 : 60}
              />
              <text
                className="tid"
                x={vertical ? x : x + 18}
                y={vertical ? y - 16 : y}
              >
                {t.id}
              </text>
            </g>
          );
        })}
        <text className="base" x="375" y="385">
          BASE DE DONNÉES
        </text>
        <text className="base sub" x="375" y="402">
          {marking.B ? "libre" : "verrouillée"}
        </text>
        {flights.map((flight, index) => (
          <circle
            className="fly"
            r="8"
            key={`${flight.from}-${flight.to}-${index}`}
          >
            <animateMotion
              dur={`${duration}ms`}
              path={arcPath(flight.from, flight.to)}
            />
          </circle>
        ))}
      </svg>
    </div>
  );
}
