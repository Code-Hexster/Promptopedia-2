import { Loader2 } from 'lucide-react';
import './Button.css';

export default function Button({
    children,
    loading = false,
    variant = 'primary',
    type = 'button',
    className = '',
    disabled,
    ...props
}) {
    return (
        <button
            type={type}
            className={`ui-button ${variant} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <div className="spinner"></div>
                    <span>Loading...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}
