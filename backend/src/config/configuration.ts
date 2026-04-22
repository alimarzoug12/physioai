export default () => ({
  jwt: {
    accessSecret:     process.env.JWT_ACCESS_SECRET  || '',
    refreshSecret:    process.env.JWT_REFRESH_SECRET || '',
    accessExpiresIn:  process.env.JWT_ACCESS_EXPIRES_IN  || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || '',
  },
  app: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    apiUrl:      process.env.API_URL      || 'http://localhost:3001',
  },
  cookie: {
    secret: process.env.COOKIE_SECRET || '',
  },
});