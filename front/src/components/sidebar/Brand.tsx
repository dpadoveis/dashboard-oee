import { BoltIcon } from '../common/icons';

export function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark">
        <BoltIcon />
      </div>
      <div className="brand-text">
        <div className="h">
          Dashboard<br />
          <em>OEE</em>
        </div>
      </div>
    </div>
  );
}
