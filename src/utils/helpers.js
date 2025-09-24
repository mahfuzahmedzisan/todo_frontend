// General utility functions
export const formatDate = (date) => {
  if (!date) return ""

  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  } catch (error) {
    console.error("Date formatting failed:", error)
    return date
  }
}

export const formatCurrency = (amount, currency = "USD") => {
  if (typeof amount !== "number") return "$0.00"

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  } catch (error) {
    console.error("Currency formatting failed:", error)
    return `$${amount.toFixed(2)}`
  }
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func, limit) => {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export const generateCSRFToken = () => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

export const sanitizeHTML = (str) => {
  const temp = document.createElement("div")
  temp.textContent = str
  return temp.innerHTML
}

export const getInitials = (name) => {
  if (!name) return ""
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, 2)
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error("Copy to clipboard failed:", error)
    return false
  }
}
