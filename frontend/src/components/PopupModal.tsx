import { ReactNode } from 'react';

interface PopupModalProps {
  open: boolean;
  title: string;
  variant?: 'success' | 'error' | 'info';
  onClose: () => void;
  children: ReactNode;
}

export default function PopupModal({
  open,
  title,
  variant = 'info',
  onClose,
  children,
}: PopupModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="popup-title">
      <div className={`modal-card modal-${variant}`}>
        <h3 id="popup-title" style={{ margin: '0 0 8px 0' }}>
          {title}
        </h3>
        <div style={{ marginBottom: 16 }}>{children}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
