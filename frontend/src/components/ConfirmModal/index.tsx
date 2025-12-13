import Modal from '@/components/Modal';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const footer = (
    <>
      <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isLoading}>
        {cancelText}
      </button>
      <button
        type="button"
        className={styles.confirmButton}
        onClick={handleConfirm}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : confirmText}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer}>
      <p className={styles.confirmMessage}>{message}</p>
    </Modal>
  );
};

export default ConfirmModal;
