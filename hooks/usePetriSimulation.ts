"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  INITIAL_MARKING,
  enabled,
  fire,
  type Marking,
  type PlaceId,
  type TransitionId,
} from "../model/petriNet";

export type Flight = {
  from: PlaceId | TransitionId;
  to: PlaceId | TransitionId;
};
export function usePetriSimulation() {
  const [marking, setMarking] = useState<Marking>(INITIAL_MARKING);
  const [previous, setPrevious] = useState("—");
  const [flights, setFlights] = useState<Flight[]>([]);
  const [flashing, setFlashing] = useState<TransitionId | null>(null);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [log, setLog] = useState([
    "État initial : Poste 1 possède le jeton, BD libre.",
  ]);
  const markingRef = useRef(marking);
  const busy = useRef(false);
  useEffect(() => {
    markingRef.current = marking;
  }, [marking]);
  const duration = 520 / speed;
  const step = useCallback(() => {
    const transition = enabled(markingRef.current);
    if (!transition || busy.current) return;
    busy.current = true;
    setFlights(transition.inputs.map((from) => ({ from, to: transition.id })));
    window.setTimeout(() => {
      setFlights([]);
      setFlashing(transition.id);
      window.setTimeout(() => {
        setFlashing(null);
        setFlights(
          transition.outputs.map((to) => ({ from: transition.id, to })),
        );
        window.setTimeout(() => {
          setFlights([]);
          setMarking(fire(transition, markingRef.current));
          setPrevious(transition.id);
          setLog((entries) =>
            [...entries, `${transition.id} : ${transition.description}`].slice(
              -7,
            ),
          );
          busy.current = false;
        }, duration);
      }, 240 / speed);
    }, duration);
  }, [duration, speed]);
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(step, 1450 / speed);
    return () => window.clearInterval(timer);
  }, [isPlaying, speed, step]);
  const reset = useCallback(() => {
    if (busy.current) return;
    setIsPlaying(false);
    setMarking(INITIAL_MARKING);
    setPrevious("—");
    setLog(["État initial : Poste 1 possède le jeton, BD libre."]);
  }, []);
  return {
    marking,
    previous,
    flights,
    flashing,
    speed,
    setSpeed,
    isPlaying,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    step,
    reset,
    log,
    enabledTransition: enabled(marking),
    animationDuration: duration,
  };
}
