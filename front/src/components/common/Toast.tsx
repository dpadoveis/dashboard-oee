import { useToast } from '../../shared/contexts/ToastContext';

export function Toast() {
  const { message, visible } = useToast();
  return (
    <div className={`toast${visible ? ' show' : ''}`}>
      <span className="blip"></span>
      <span>{message}</span>
    </div>
  );
}
