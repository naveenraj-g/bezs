import { auth } from "../services/better-auth/auth";

export type Session = typeof auth.$Infer.Session;
