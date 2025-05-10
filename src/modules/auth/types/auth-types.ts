import { auth } from "../services/better-auth/auth";

export type Session = typeof auth.$Infer.Session;
export type OrganizationType = typeof auth.$Infer.Organization;
export type MemberType = typeof auth.$Infer.Member;
export type InvitationType = typeof auth.$Infer.Invitation;

export type RBACsessionType = typeof auth.$Infer.Session.userRBAC;
