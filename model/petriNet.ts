export const PLACE_IDS = [
  "P11",
  "P12",
  "P21",
  "P22",
  "P31",
  "P32",
  "P41",
  "P42",
  "B",
] as const;
export type PlaceId = (typeof PLACE_IDS)[number];
export type Marking = Record<PlaceId, number>;
export type TransitionId =
  | "D1"
  | "F1"
  | "D2"
  | "F2"
  | "D3"
  | "F3"
  | "D4"
  | "F4";
export type Transition = {
  id: TransitionId;
  inputs: PlaceId[];
  outputs: PlaceId[];
  description: string;
};
export const INITIAL_MARKING: Marking = {
  P11: 1,
  P12: 0,
  P21: 0,
  P22: 0,
  P31: 0,
  P32: 0,
  P41: 0,
  P42: 0,
  B: 1,
};
export const TRANSITIONS: Transition[] = [1, 2, 3, 4].flatMap((n) => [
  {
    id: `D${n}` as TransitionId,
    inputs: [`P${n}1` as PlaceId, "B"],
    outputs: [`P${n}2` as PlaceId],
    description: `Poste ${n} commence son traitement ; BD verrouillée.`,
  },
  {
    id: `F${n}` as TransitionId,
    inputs: [`P${n}2` as PlaceId],
    outputs: ["B", `P${n === 4 ? 1 : n + 1}1` as PlaceId],
    description: `Poste ${n} termine, BD libérée et jeton transmis.`,
  },
]);
export function enabled(m: Marking) {
  return TRANSITIONS.find((t) => t.inputs.every((x) => m[x] > 0));
}
export function fire(t: Transition, m: Marking): Marking {
  const n = { ...m };
  t.inputs.forEach((x) => n[x]--);
  t.outputs.forEach((x) => n[x]++);
  return n;
}
