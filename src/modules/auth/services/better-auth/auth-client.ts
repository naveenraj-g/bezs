import { BETTER_AUTH_URL } from "@/lib/constants/env";
import { twoFactorClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: BETTER_AUTH_URL,
  plugins: [twoFactorClient()],
});

export const { useSession } = authClient;
