import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';
import { IconClose } from './Icons';

/** Mobile bottom sheet with drag-to-dismiss. */
export default function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  full = false,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  full?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="sheet-root" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div className="sheet-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            className={`sheet ${full ? 'sheet--full' : ''}`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
          >
            <div className="sheet__grip" />
            {title && (
              <div className="sheet__head">
                <h3>{title}</h3>
                <button className="icon-btn" onClick={onClose} aria-label="Close">
                  <IconClose size={20} />
                </button>
              </div>
            )}
            <div className="sheet__body">{children}</div>
            {footer && <div className="sheet__foot">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
