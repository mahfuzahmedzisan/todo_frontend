"use client"

import { useState, useEffect } from "react"
import Alert from "../ui/Alert.jsx"
import Button from "../ui/Button.jsx"

const SecurityAlert = () => {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    // Check for security issues
    const checkSecurityIssues = () => {
      const issues = []

      // Check if running on HTTP in production
      if (window.location.protocol === "http:" && window.location.hostname !== "localhost") {
        issues.push({
          id: "insecure-connection",
          type: "warning",
          title: "Insecure Connection",
          message: "This site is not using HTTPS. Your data may not be secure.",
          action: "Switch to HTTPS",
        })
      }

      // Check for mixed content
      if (
        window.location.protocol === "https:" &&
        document.querySelectorAll('img[src^="http:"], script[src^="http:"]').length > 0
      ) {
        issues.push({
          id: "mixed-content",
          type: "warning",
          title: "Mixed Content Detected",
          message: "This page contains insecure content that may compromise security.",
          action: "Report Issue",
        })
      }

      // Check for outdated browser
      const isOutdatedBrowser = () => {
        const userAgent = navigator.userAgent
        // Simple check for very old browsers
        return (
          userAgent.includes("MSIE") ||
          (userAgent.includes("Chrome") && Number.parseInt(userAgent.match(/Chrome\/(\d+)/)?.[1] || "0") < 90) ||
          (userAgent.includes("Firefox") && Number.parseInt(userAgent.match(/Firefox\/(\d+)/)?.[1] || "0") < 88)
        )
      }

      if (isOutdatedBrowser()) {
        issues.push({
          id: "outdated-browser",
          type: "warning",
          title: "Outdated Browser",
          message: "Your browser may not support the latest security features. Please update for better security.",
          action: "Update Browser",
        })
      }

      setAlerts(issues)
    }

    checkSecurityIssues()
  }, [])

  const dismissAlert = (alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))

    // Store dismissed alerts in localStorage
    const dismissed = JSON.parse(localStorage.getItem("dismissedSecurityAlerts") || "[]")
    dismissed.push(alertId)
    localStorage.setItem("dismissedSecurityAlerts", JSON.stringify(dismissed))
  }

  const handleAction = (alert) => {
    switch (alert.id) {
      case "insecure-connection":
        window.location.href = window.location.href.replace("http:", "https:")
        break
      case "mixed-content":
        // Report mixed content issue
        console.warn("Mixed content detected on page")
        break
      case "outdated-browser":
        // Open browser update page
        window.open("https://browsehappy.com/", "_blank")
        break
      default:
        break
    }
  }

  // Filter out dismissed alerts
  const dismissedAlerts = JSON.parse(localStorage.getItem("dismissedSecurityAlerts") || "[]")
  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.includes(alert.id))

  if (visibleAlerts.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {visibleAlerts.map((alert) => (
        <Alert key={alert.id} variant={alert.type === "warning" ? "warning" : "destructive"} className="shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-1">{alert.title}</h4>
              <p className="text-xs opacity-90">{alert.message}</p>

              {alert.action && (
                <div className="mt-2 flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-6 bg-transparent"
                    onClick={() => handleAction(alert)}
                  >
                    {alert.action}
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs h-6" onClick={() => dismissAlert(alert.id)}>
                    Dismiss
                  </Button>
                </div>
              )}
            </div>

            <button onClick={() => dismissAlert(alert.id)} className="ml-2 opacity-70 hover:opacity-100">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </Alert>
      ))}
    </div>
  )
}

export default SecurityAlert
