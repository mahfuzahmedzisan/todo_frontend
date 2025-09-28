import React from 'react';

// Sub-components remain the same
export const AlertTitle = ({ children, className = "" }) => (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>{children}</h5>
);

export const AlertDescription = ({ children, className = "" }) => (
    <div className={`text-sm [&_p]:leading-relaxed ${className}`}>{children}</div>
);

// Main Alert component using standard Tailwind classes
const Alert = ({ 
    children, 
    variant = "default", 
    className = "", 
    onClose,
    title, 
    description 
}) => {
    // Base styling for all alerts
    const baseClasses = "relative w-full rounded-lg border p-4";

    // 🚩 IMPORTANT: Using standard Tailwind classes instead of custom variables 🚩
    const variants = {
        // Default: Light gray background, dark text, subtle border
        default: "bg-gray-50 text-gray-800 border-gray-200", 
        // Destructive (Error): Light red background, bright red text, vivid border
        destructive: "bg-red-50 text-red-700 border-red-300",
        // Success: Light green background, dark green text
        success: "bg-green-50 text-green-700 border-green-300", 
        // Warning: Light yellow/amber background, dark amber text
        warning: "bg-amber-50 text-amber-700 border-amber-300", 
        // Info: Light blue background, dark blue text
        info: "bg-blue-50 text-blue-700 border-blue-300", 
    };

    const classes = `${baseClasses} ${variants[variant]} ${className}`;

    return (
        <div className={classes} role="alert">
            {onClose && (
                <button
                    onClick={onClose}
                    // Adjusted Tailwind classes for the close button
                    className="absolute right-2 top-2 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                >
                    <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="sr-only">Close</span>
                </button>
            )}
            
            {title && <AlertTitle>{title}</AlertTitle>}
            
            {(description || children) && (
                <AlertDescription>
                    {description || children}
                </AlertDescription>
            )}
        </div>
    );
}

export default Alert;