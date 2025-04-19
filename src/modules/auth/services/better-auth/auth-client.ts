import { BETTER_AUTH_URL } from "@/lib/constants/env";
import {
  twoFactorClient,
  adminClient,
  organizationClient,
} from "better-auth/client/plugins";
import { username } from "better-auth/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: BETTER_AUTH_URL,
  plugins: [twoFactorClient(), adminClient(), username(), organizationClient()],
});

export const { useSession } = authClient;
