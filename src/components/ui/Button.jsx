import { Link } from "react-router-dom";

const Spinner = ({ className = "h-4 w-4" }) => (
    <svg
        className={`animate-spin ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        ></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
    </svg>
);

// --- The Core Button Component ---

export default function Button({
    children,
    variant = "primary",
    size = "md",
    outline = false,
    dashed = false,
    link = false,
    href = "",
    target = "_self",
    rel = "",
    disabled = false,
    loading = false,
    loadingPosition = "right",
    type = "button",
    className = "",
    onClick,
    ...props
}) {
    // 1. Base Classes: Common styles applied to all buttons
    const baseClasses = `inline-flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 font-semibold rounded-md ${loading || disabled ? "pointer-events-none" : "cursor-pointer"}`;

    // 2. Variant Definitions: Base styles (solid fill)
    const variantStyles = {
        primary: {
            base: "bg-primary-600 text-white hover:bg-primary-700",
            border: "border-primary-600",
            text: "text-primary-600",
            hoverBg: "hover:bg-primary-50",
            ring: "focus:ring-primary-600",
        },
        secondary: {
            base: "bg-primary-100 text-primary-800 hover:bg-primary-200",
            border: "border-primary-300",
            text: "text-primary-800",
            hoverBg: "hover:bg-primary-100",
            ring: "focus:ring-primary-200",
        },
        danger: {
            base: "bg-red-600 text-white hover:bg-red-700",
            border: "border-red-600",
            text: "text-red-600",
            hoverBg: "hover:bg-red-50",
            ring: "focus:ring-red-600",
        },
        ghost: {
            base: "bg-transparent text-primary-800 hover:bg-primary-100",
            border: "border-transparent",
            text: "text-primary-800",
            hoverBg: "hover:bg-primary-100",
            ring: "focus:ring-primary-400",
        },
    };

    const currentStyles = variantStyles[variant] || variantStyles.primary;

    // 3. Size Definitions
    const sizeClasses = {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 py-2 text-base",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10 p-0",
    };

    const currentSize = sizeClasses[size] || sizeClasses.md;

    // 4. Conditional Class Assembly
    let finalClasses = baseClasses;

    if (link) {
        // Link style overrides size, background, border, and most styling
        finalClasses += " text-primary-600 hover:text-primary-800 px-3 py-0 h-auto font-medium text-base underline-offset-4 hover:underline";
    } else if (outline) {
        // Outline style: Transparent background, colored border and text
        finalClasses += ` ${currentSize} border-2 ${currentStyles.border} ${currentStyles.text} bg-transparent ${currentStyles.hoverBg}`;
    } else if (dashed) {

        finalClasses += ` ${currentSize} border-dashed border-2 ${currentStyles.border} ${currentStyles.text} bg-transparent ${currentStyles.hoverBg}`;
    }
    else {
        // Default solid fill style
        finalClasses += ` ${currentSize} ${currentStyles.base} ${currentStyles.ring}`;
    }

    // Append custom class names last to allow user overrides
    finalClasses += ` ${className}`;

    return (
        <>
            {link && href ? (
                <Link
                    to={href}
                    target={target}
                    rel={rel}
                    className={finalClasses}
                    disabled={disabled || loading}
                    onClick={onClick}
                    {...props}
                >
                    {loading ?
                        (
                            <>
                                {loadingPosition === "left" ? (
                                    <>
                                        <Spinner className={`mr-2 ${size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} ${outline ? currentStyles.text : 'text-current'}`} />
                                        {children}
                                    </>
                                ) : (
                                    <>
                                        {children}
                                        <Spinner className={`ml-2 ${size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} ${outline ? currentStyles.text : 'text-current'}`} />
                                    </>

                                )}
                            </>
                        ) : (
                            <>
                                {children}
                            </>
                        )
                    }
                </Link>
            ) : (
                <button
                    type={type}
                    className={finalClasses}
                    disabled={disabled || loading}
                    onClick={onClick}
                    {...props}
                >
                    {loading ?
                        (
                            <>
                                {loadingPosition === "left" ? (
                                    <>
                                        <Spinner className={`mr-2 ${size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} ${outline ? currentStyles.text : 'text-current'}`} />
                                        {children}
                                    </>
                                ) : (
                                    <>
                                        {children}
                                        <Spinner className={`ml-2 ${size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} ${outline ? currentStyles.text : 'text-current'}`} />
                                    </>

                                )}
                            </>
                        ) : (
                            <>
                                {children}
                            </>
                        )
                    }
                </button>
            )
            }
        </>
    );
};