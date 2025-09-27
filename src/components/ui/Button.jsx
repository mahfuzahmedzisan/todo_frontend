const Button = ({
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    type = "button",
    className = "",
    onClick,
    ...props
}) => {
    const baseClasses =
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    const variants = {
        primary: "btn btn-primary",
        secondary: "btn btn-secondary",
        destructive: "btn btn-error",
        outline: "btn btn-outline btn-primary",
        ghost: "btn btn-ghost btn-primary",
        link: "btn btn-link",
    }

    const sizes = {
        sm: "h-9 rounded-md px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    }

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

    return (
        <button type={type} className={classes} disabled={disabled || loading} onClick={onClick} {...props}>
            {loading && (
                <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}
            {children}
        </button>
    )
}

export default Button
