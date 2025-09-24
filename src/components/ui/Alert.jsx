"use client"

const Alert = ({ children, variant = "default", className = "", onClose }) => {
  const baseClasses = "relative w-full rounded-lg border p-4"

  const variants = {
    default: "bg-background text-foreground border-border",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    info: "bg-info/10 text-info border-info/20",
  }

  const classes = `${baseClasses} ${variants[variant]} ${className}`

  return (
    <div className={classes} role="alert">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
      {children}
    </div>
  )
}

export const AlertTitle = ({ children, className = "" }) => (
  <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>{children}</h5>
)

export const AlertDescription = ({ children, className = "" }) => (
  <div className={`text-sm [&_p]:leading-relaxed ${className}`}>{children}</div>
)

export default Alert
