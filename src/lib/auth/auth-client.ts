import {
  organizationClient,
  passkeyClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import getEnvConfig from "../env-config";

export const authClient = createAuthClient({
  baseURL: getEnvConfig().baseUrl,
  plugins: [passkeyClient(), twoFactorClient(), organizationClient()],
});
