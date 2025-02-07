const envConfig = {
  baseUrl: process.env.BASE_URL!,
  db: { databaseUrl: process.env.DATABASE_URL! },
  auth: {
    betterAuth: { secret: process.env.BETTER_AUTH_SECRET! },
    githubOauth: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  email: {
    resendApiKey: process.env.RESEND_API_KEY!,
    customEmail: process.env.CUSTOM_EMAIL!,
  },
};

export default envConfig;
