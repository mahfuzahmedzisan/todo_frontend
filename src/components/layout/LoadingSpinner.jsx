const LoadingSpinner = ({ size = "md", text = "Loading...", className = "" }) => {
    const sizes = {
        sm: "h-6 w-6",
        md: "h-12 w-12",
        lg: "h-16 w-16",
    }

    return (
        <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
            <div className={`animate-spin rounded-full border-b-2 border-primary ${sizes[size]}`}></div>
            {text && <p className="text-muted-foreground text-sm">{text}</p>}
        </div>
    )
}

export default LoadingSpinner
