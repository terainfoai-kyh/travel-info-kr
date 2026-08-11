import { useEffect, useRef } from 'react';

/**
 * Custom hook to prevent mobile browser back-button from closing the entire app when a modal is open.
 * Instead of navigating away, pressing the back button/gesture on mobile will smoothly close the active modal.
 * 
 * @param {boolean} isOpen - Whether the modal is currently visible
 * @param {function} onClose - Callback function to close the modal
 * @param {string} modalId - Unique identifier for the modal instance
 */
export function useModalHistory(isOpen, onClose, modalId = 'modal') {
  const pushedRef = useRef(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const modalStateKey = `ktravel_modal_${modalId}_${Date.now()}`;
    
    // Push virtual history state when modal opens
    window.history.pushState({ isModalState: true, key: modalStateKey }, '');
    pushedRef.current = true;

    const handlePopState = () => {
      if (pushedRef.current) {
        pushedRef.current = false;
        if (typeof onCloseRef.current === 'function') {
          onCloseRef.current();
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // If modal was closed by UI button (e.g., X button/backdrop click) rather than back button,
      // revert the pushed history entry to keep history stack clean.
      if (pushedRef.current) {
        pushedRef.current = false;
        try {
          window.history.back();
        } catch (e) {
          console.warn('Modal history revert skipped:', e);
        }
      }
    };
  }, [isOpen, modalId]);
}

export default useModalHistory;
