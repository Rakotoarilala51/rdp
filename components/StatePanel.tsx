import { PLACE_IDS } from "../model/petriNet";
import type { Marking } from "../model/petriNet";
type Props = { marking: Marking; previous: string; next?: string };
export function StatePanel({ marking, previous, next }: Props) {
  const owner = PLACE_IDS.find((id) => id !== "B" && marking[id]);
  return (
    <aside>
      <div className="card">
        <small>ÉTAT DU RÉSEAU</small>
        <h2>Marquage courant</h2>
        <div className="marks">
          {PLACE_IDS.map((id) => (
            <span key={id}>
              {id}
              <b className={marking[id] ? "yes" : ""}>{marking[id]}</b>
            </span>
          ))}
        </div>
      </div>
      <div className="card info">
        <p>
          Transition précédente <b>{previous}</b>
        </p>
        <p>
          Suivante activée <b className="green">{next ?? "—"}</b>
        </p>
        <p>
          Token Ring <b>{owner ? `Poste ${owner[1]}` : "en traitement"}</b>
        </p>
        <p>
          Base de données{" "}
          <b className={marking.B ? "green" : "orange"}>
            {marking.B ? "Libre" : "Verrouillée"}
          </b>
        </p>
      </div>
    </aside>
  );
}
