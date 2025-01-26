import { createAuthClient } from "better-auth/react";

import envConfig from "./env-config";

export const authClient = createAuthClient({
  baseURL: envConfig.baseUrl,
});
