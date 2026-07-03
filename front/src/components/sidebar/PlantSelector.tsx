interface PlantSelectorProps {
  current: string;
}

export function PlantSelector({ current }: PlantSelectorProps) {
  return (
    <div className="selector" style={{ cursor: 'default' }}>
      <span className="left">
        <span className="dot"></span>
        <span>{current}</span>
      </span>
    </div>
  );
}
