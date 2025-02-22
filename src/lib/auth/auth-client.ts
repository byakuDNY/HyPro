import {
  oneTapClient,
  organizationClient,
  passkeyClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import getEnvConfig from "../env-config";

export const authClient = createAuthClient({
  baseURL: getEnvConfig().baseUrl,
  plugins: [
    passkeyClient(),
    organizationClient(),
    oneTapClient({
      clientId: getEnvConfig().auth.google.clientId,
      autoSelect: false,
      cancelOnTapOutside: true,
      context: "signin",
    }),
  ],
});
