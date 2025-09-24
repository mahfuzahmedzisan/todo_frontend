import { ROUTES } from "../constants/routes"

// Navigation helper functions
export const navigateToLogin = (navigate, from = null) => {
  navigate(ROUTES.LOGIN, {
    state: { from: from || window.location.pathname },
    replace: true,
  })
}

export const navigateToDashboard = (navigate) => {
  navigate(ROUTES.DASHBOARD, { replace: true })
}

export const navigateToHome = (navigate) => {
  navigate(ROUTES.HOME, { replace: true })
}

export const getRedirectPath = (location, user) => {
  const from = location.state?.from

  if (user && from && from !== ROUTES.LOGIN && from !== ROUTES.REGISTER) {
    return from
  }

  return user ? ROUTES.DASHBOARD : ROUTES.HOME
}
