type Props = {
  onStep: () => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  speed: number;
  onSpeed: (value: number) => void;
  isPlaying: boolean;
};
export function Controls({
  onStep,
  onPlay,
  onPause,
  onReset,
  speed,
  onSpeed,
  isPlaying,
}: Props) {
  return (
    <footer>
      <button className="primary" onClick={onStep}>
        Étape suivante →
      </button>
      <button onClick={onPlay} disabled={isPlaying}>
        Lecture automatique
      </button>
      <button onClick={onPause} disabled={!isPlaying}>
        Pause
      </button>
      <button onClick={onReset}>↺ Réinitialiser</button>
      <label>
        Vitesse{" "}
        {[0.5, 1, 2].map((value) => (
          <button
            key={value}
            className={value === speed ? "sel" : ""}
            onClick={() => onSpeed(value)}
          >
            {value}x
          </button>
        ))}
      </label>
    </footer>
  );
}
