const {
  BASE_URL = "",
  DATABASE_URL = "",
  BETTER_AUTH_SECRET = "",
  GITHUB_CLIENT_ID = "",
  GITHUB_CLIENT_SECRET = "",
  GOOGLE_CLIENT_ID = "",
  GOOGLE_CLIENT_SECRET = "",
  RESEND_API_KEY = "",
  SENDER_EMAIL = "",
} = process.env;

const envConfig = () => ({
  baseUrl: BASE_URL,
  database: { url: DATABASE_URL },
  auth: {
    betterAuth: { secret: BETTER_AUTH_SECRET },
    github: {
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  },
  email: {
    resendApiKey: RESEND_API_KEY,
    sender: SENDER_EMAIL,
  },
});

export default envConfig;
