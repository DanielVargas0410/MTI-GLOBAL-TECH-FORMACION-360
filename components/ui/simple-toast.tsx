'use client';

import { useState, useEffect } from 'react';

interface SimpleToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  variant: 'default' | 'destructive';
}

export function SimpleToast({ message, show, onClose, variant }: SimpleToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  const baseStyle: React.CSSProperties = {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      transition: 'opacity 0.3s ease-in-out',
      opacity: show ? 1 : 0,
  };

  const variantStyle: React.CSSProperties = {
      default: {
          backgroundColor: '#28a745', // Green for success
      },
      destructive: {
          backgroundColor: '#dc3545', // Red for error
      },
  };

  return (
    <div style={{ ...baseStyle, ...variantStyle[variant] }}>
      {message}
    </div>
  );
}