export const config = {
  db: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    name: process.env.DB_NAME!,
    port: parseInt(process.env.DB_PORT || '3306'),
  },
  api: {
    baseUrl: process.env.API_BASE_URL,
    endpoint: process.env.API_ENDPOINT,
  },
  app: {
    minutesPerAd: parseInt(process.env.NEXT_PUBLIC_MINUTES_PER_AD || '30'),
    qrSessionTtl: parseInt(process.env.QR_SESSION_TTL || '300'),
    serverTimeTolerance: parseInt(process.env.SERVER_TIME_TOLERANCE || '120'),
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600'),
    adDurationSeconds: parseInt(process.env.AD_DURATION_SECONDS || '30'),
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  },
};

export default config;
