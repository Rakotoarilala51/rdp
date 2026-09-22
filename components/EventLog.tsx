export function EventLog({ entries }: { entries: string[] }) {
  return (
    <div className="card journal">
      <small>JOURNAL D’EXÉCUTION</small>
      {entries.map((entry, index) => (
        <p key={`${entry}-${index}`}>
          {index + 1}. {entry}
        </p>
      ))}
    </div>
  );
}
