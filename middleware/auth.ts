export default defineNuxtRouteMiddleware(async (to) => {
  const event = useRequestEvent()
 
  // Skip auth check for login and register pages
  if (to.path === '/login' || to.path === '/register') {
    return
  }

  // Skip auth check for public pages
  if (to.path === '/' || to.path === '/about') {
    return
  }
 
  // Skip auth check for public assets
  if (to.path.startsWith('/_nuxt/') || to.path.startsWith('/assets/')) {
    return
  }
 
  try {
 
    const token = useCookie( 'authTokenCKKey')
 
 
    
    if (!token) {
      return navigateTo('/login')
    }
 

    // Check if trying to access protected routes without token
    if ((to.path === '/settings' || to.path === '/posts') && !token) {
      return navigateTo('/login')
    }

    // Verify token using jwtverify API
    try {
 

      const response = await $fetch('/api/jwtverify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })
 
      
      if (!response?.body?.valid) {
        return navigateTo('/login')
      }
      
      // Check user rank for protected routes
      if ((to.path === '/settings' || to.path === '/posts') && response?.body?.userrank < 1) {
        return navigateTo('/login')
      }
 
      
      return
    } catch (err) {
      return navigateTo('/login')
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    return navigateTo('/login')
  }
})