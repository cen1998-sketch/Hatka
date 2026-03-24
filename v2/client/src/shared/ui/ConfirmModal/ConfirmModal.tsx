import * as React from "react";
import { AlertTriangle, X } from "lucide-react";
import s from "./ConfirmModal.module.css";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  type = 'danger'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>
        <div className={s.iconWrapper}>
          <AlertTriangle size={24} />
        </div>
        
        <h3 className={s.title}>{title}</h3>
        <p className={s.message}>{message}</p>
        
        <div className={s.actions}>
          <button className={s.btnCancel} onClick={onClose}>
            {cancelText}
          </button>
          <button className={s.btnConfirm} onClick={() => {
            onConfirm();
            onClose();
          }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
