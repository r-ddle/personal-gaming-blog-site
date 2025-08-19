"use client";

import { useState, useEffect } from "react";
import { IconCheck, IconX, IconExclamationMark, IconInfoCircle } from "@tabler/icons-react";

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <IconCheck size={20} />;
      case 'error':
        return <IconX size={20} />;
      case 'warning':
        return <IconExclamationMark size={20} />;
      case 'info':
        return <IconInfoCircle size={20} />;
      default:
        return <IconInfoCircle size={20} />;
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'warning':
        return 'toast-warning';
      case 'info':
        return 'toast-info';
      default:
        return 'toast-info';
    }
  };

  return (
    <div className={`toast ${getTypeClass()} scale-in`}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-content">
        <div className="toast-title">{title}</div>
        {message && <div className="toast-message">{message}</div>}
      </div>
      <button 
        className="toast-close" 
        onClick={() => onClose(id)}
        aria-label="Close notification"
      >
        <IconX size={16} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
  }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={onClose}
        />
      ))}
    </div>
  );
}