import {
  PLACE_IDS,
  TRANSITIONS,
  type PlaceId,
  type TransitionId,
} from "./petriNet";

export const NODE_POSITIONS: Record<PlaceId | TransitionId, [number, number]> =
  {
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
export const ARCS = TRANSITIONS.flatMap((transition) => [
  ...transition.inputs.map((from) => ({ from, to: transition.id })),
  ...transition.outputs.map((to) => ({ from: transition.id, to })),
]);
export function arcPath(
  from: PlaceId | TransitionId,
  to: PlaceId | TransitionId,
) {
  const [x, y] = NODE_POSITIONS[from];
  const [X, Y] = NODE_POSITIONS[to];
  const distance = Math.hypot(X - x, Y - y);
  const start = from === "B" || from.startsWith("P") ? 27 : 8;
  const end = to === "B" || to.startsWith("P") ? 30 : 8;
  return `M${x + ((X - x) / distance) * start},${y + ((Y - y) / distance) * start} L${X - ((X - x) / distance) * end},${Y - ((Y - y) / distance) * end}`;
}
export { PLACE_IDS };
