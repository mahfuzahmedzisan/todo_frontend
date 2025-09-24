import { forwardRef } from "react"

const Input = forwardRef(({ type = "text", className = "", error = false, disabled = false, ...props }, ref) => {
  const baseClasses =
    "flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

  const errorClasses = error ? "border-destructive focus-visible:ring-destructive" : ""

  const classes = `${baseClasses} ${errorClasses} ${className}`

  return <input type={type} className={classes} disabled={disabled} ref={ref} {...props} />
})

Input.displayName = "Input"

export default Input
