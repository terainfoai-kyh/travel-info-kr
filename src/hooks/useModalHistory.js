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
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    let isPushed = false;
    const modalStateKey = `ktravel_modal_${modalId}_${Date.now()}`;
    
    try {
      window.history.pushState({ isModalState: true, key: modalStateKey }, '');
      isPushed = true;
    } catch (e) {}

    const handlePopState = () => {
      if (isPushed) {
        isPushed = false;
        if (typeof onCloseRef.current === 'function') {
          onCloseRef.current();
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen]);
}

export default useModalHistory;
