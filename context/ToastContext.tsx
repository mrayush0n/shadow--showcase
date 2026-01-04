import React, { createContext, useContext, useState, useCallback } from 'react';
import { Icon } from '../components/Icon';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
    const config = {
        success: { icon: 'check_circle', bg: 'bg-emerald-500', border: 'border-emerald-400' },
        error: { icon: 'error', bg: 'bg-red-500', border: 'border-red-400' },
        warning: { icon: 'warning', bg: 'bg-amber-500', border: 'border-amber-400' },
        info: { icon: 'info', bg: 'bg-blue-500', border: 'border-blue-400' },
    }[toast.type];

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border ${config.border} bg-white dark:bg-slate-800 animate-slide-in`}
            style={{ animation: 'slideIn 0.3s ease-out' }}
        >
            <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                <Icon name={config.icon} className="text-white text-lg" />
            </div>
            <p className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">{toast.message}</p>
            <button
                onClick={onRemove}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
                <Icon name="close" className="text-slate-400 text-sm" />
            </button>
        </div>
    );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 4 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
                ))}
            </div>
            <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </ToastContext.Provider>
    );
};
