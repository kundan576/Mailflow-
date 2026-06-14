export const config = {
  appName: 'Mailflow',
  corsair: {
    appId: process.env.NEXT_PUBLIC_CORSAIR_APP_ID || 'YOUR_APP_ID',
    authUrl: `https://auth.corsair.dev/login?app_id=${process.env.NEXT_PUBLIC_CORSAIR_APP_ID || 'YOUR_APP_ID'}`,
    apiBase: 'https://api.corsair.dev',
  },
}
