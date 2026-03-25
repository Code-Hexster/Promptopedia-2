import { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import '../components/ui/Toast.css'; // Keeping this in case other components depend on it

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const defaultStyle = {
        borderRadius: '12px',
        background: '#1a1a1a',
        color: '#ffffff',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
    };

    const success = (title, message) => toast.success(message || title, {
        style: defaultStyle,
        iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
        },
    });

    const error = (title, message) => toast.error(message || title, {
        style: defaultStyle,
        iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
        },
    });

    const info = (title, message) => toast(message || title, {
        icon: 'ℹ️',
        style: defaultStyle,
    });

    return (
        <ToastContext.Provider value={{ success, error, info }}>
            {children}
            <Toaster
                position="bottom-center"
                toastOptions={{ duration: 4000 }}
            />
        </ToastContext.Provider>
    );
};
