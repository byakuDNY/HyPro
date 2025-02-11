import { Resend } from "resend";

import envConfig from "@/lib/env-config";

const resend = new Resend(envConfig().email.resendApiKey);

export default resend;
