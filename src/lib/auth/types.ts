import { authClient } from "./auth-client";
import type auth from "./better-auth";

export type Session = typeof auth.$Infer.Session;

export type User = typeof authClient.$Infer.Session.user;
export type ActiveOrganization = typeof authClient.$Infer.ActiveOrganization;
export type Member = typeof authClient.$Infer.Member;
export type Invitation = typeof authClient.$Infer.Invitation;
export type Organization = typeof authClient.$Infer.Organization;
