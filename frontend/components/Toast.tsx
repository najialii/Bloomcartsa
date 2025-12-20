'use client';

import { useEffect } from 'react';
import { X, CheckCircle, Heart, ShoppingBasket } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'wishlist' | 'cart';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    wishlist: <Heart className="w-5 h-5 text-red-500 fill-current" />,
    cart: <ShoppingBasket className="w-5 h-5 text-neutral-900" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    wishlist: 'bg-red-50 border-red-200',
    cart: 'bg-neutral-50 border-neutral-200',
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${bgColors[type]} animate-slide-in-right`}
    >
      {icons[type]}
      <p className="text-sm font-medium text-neutral-900 flex-1">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/50 rounded transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4 text-neutral-600" />
      </button>
    </div>
  );
}
