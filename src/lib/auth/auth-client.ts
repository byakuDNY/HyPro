import {
  oneTapClient,
  organizationClient,
  passkeyClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import envConfig from "../env-config";

export const authClient = createAuthClient({
  baseURL: envConfig().baseUrl,
  plugins: [
    passkeyClient(),
    organizationClient(),
    oneTapClient({
      clientId: envConfig().auth.google.clientId,
    }),
  ],
});
