interface SectionTagProps {
  num: string;
  label: string;
}

export function SectionTag({ num, label }: SectionTagProps) {
  return (
    <div className="sec-tag">
      <span className="num">{num}</span>
      <span>{label}</span>
      <span className="line"></span>
    </div>
  );
}
