"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ChevronDown, Mail, Trash, Users } from "lucide-react";

import LoadingButton from "@/components/loading-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { showToast } from "@/hooks/use-custom-toast";
import { authClient } from "@/lib/auth/auth-client";
import {
  type ActiveOrganization,
  Invitation,
  Member,
  Organization,
  type User,
} from "@/lib/auth/types";
import { getInitials } from "@/lib/utils";

import { revalidatePathAction } from "../actions";
import CreateOrganizationDialog from "./create-organization.dialog";
import InviteMemberDialog from "./invite-member-dialog";

const OrganizationCard = ({
  user,
  activeOrganization,
  listOrganizations: organizations,
}: {
  user: User;
  activeOrganization: ActiveOrganization | null;
  listOrganizations: Organization[] | null;
}) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string[]>([]);
  const [isRevoking, setIsRevoking] = useState<string[]>([]);
  const [activeOrg, setActiveOrg] = useState<ActiveOrganization | null>(
    activeOrganization,
  );

  const currentMember = activeOrg?.members.find(
    (member) => member.userId === user.id,
  );

  const handleSetOrganization = async (org: Organization | null) => {
    setIsLoading(true);

    if (org?.id === activeOrg?.id) {
      return;
    }

    if (org === null) {
      authClient.organization.setActive(
        {
          organizationId: null,
        },
        {
          onSuccess: () => {
            setActiveOrg(null);
            router.refresh();

            showToast(
              "success",
              "Personal is now set as the active organization.",
            );
          },
          onError: (ctx) => {
            showToast("error", ctx.error.message);
          },
          onRequest: () => {
            showToast("loading", "Setting active organization...");
          },
        },
      );
      await revalidatePathAction();
      return;
    }

    authClient.organization.setActive(
      {
        organizationId: org.id,
      },
      {
        onSuccess: (ctx) => {
          setActiveOrg(ctx.data);
          showToast(
            "success",
            `${ctx.data.name} is now set as the active organization.`,
          );
        },
        onError: (ctx) => {
          showToast("error", ctx.error.message);
        },
        onRequest: () => {
          showToast("loading", "Setting active organization...");
        },
      },
    );
    await revalidatePathAction();

    setIsLoading(false);
  };

  const handleRemoveMember = async (memberId: Member["id"]) => {
    setIsRemoving((prev) => [...prev, memberId]);
    await authClient.organization.removeMember(
      {
        memberIdOrEmail: memberId,
      },
      {
        onSuccess: (ctx) => {
          if (activeOrg) {
            setActiveOrg({
              ...activeOrg,
              members: activeOrg.members.filter(
                (member) => member.id !== memberId,
              ),
            });
          }
          showToast(
            "success",
            `${ctx.data.member.user.name} removed successfully`,
          );
        },
        onError: (ctx) => {
          showToast("error", ctx.error.message);
        },
        onRequest: () => {
          showToast("loading", "Removing member...");
        },
      },
    );
    setIsRemoving((prev) => prev.filter((id) => id !== memberId));
  };

  const handleCancelInvitation = async (invitationId: Invitation["id"]) => {
    setIsRevoking((prev) => [...prev, invitationId]);

    await authClient.organization.cancelInvitation(
      {
        invitationId: invitationId,
      },
      {
        onSuccess: (ctx) => {
          if (activeOrg) {
            setActiveOrg({
              ...activeOrg,
              invitations: activeOrg.invitations.filter(
                (inv) => inv.id !== invitationId,
              ),
            });
          }
          showToast(
            "success",
            `${ctx.data.email} invitation revoked successfully`,
          );
        },
        onError: (ctx) => {
          showToast("error", ctx.error.message);
        },
        onRequest: () => {
          showToast("loading", "Revoking invitation...");
        },
      },
    );

    setIsRevoking((prev) => prev.filter((id) => id !== invitationId));
  };

  const handleDeleteOrganization = async () => {
    if (!activeOrg?.id) {
      showToast("error", "You can't delete your personal workspace.");
      return;
    }

    setIsLoading(true);
    await authClient.organization.delete(
      {
        organizationId: activeOrg.id,
      },
      {
        onSuccess: () => {
          showToast("success", "Organization deleted successfully");
          setActiveOrg(null);

          // Update the organizations list
          if (organizations) {
            organizations.filter((org) => org.id !== activeOrg.id);
            router.push("/organizations");
          }
        },
        onError: (ctx) => {
          showToast("error", ctx.error.message);
        },
        onRequest: () => {
          showToast("loading", "Deleting organization...");
        },
      },
    );

    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizations</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-8">
        {/* Organization Selector */}
        <div className="flex items-start justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage
                    src={activeOrg?.logo ?? undefined}
                    alt="Organization Logo"
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {getInitials(activeOrg?.name || "P")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {activeOrg?.name || "Personal"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activeOrg?.members.length || 1} members
                  </p>
                </div>
                <ChevronDown className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                className="py-1"
                onClick={() => handleSetOrganization(null)}
              >
                <Avatar className="mr-2 size-5">
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
                <span className="sm text-sm">Personal</span>
              </DropdownMenuItem>

              {organizations?.map((org) => (
                <DropdownMenuItem
                  className="py-1"
                  key={org.id}
                  onClick={() => handleSetOrganization(org)}
                >
                  <Avatar className="mr-2 size-5">
                    <AvatarImage src={org.logo ?? undefined} alt={org.name} />
                    <AvatarFallback>{getInitials(org.name)}</AvatarFallback>
                  </Avatar>
                  <span className="sm text-sm">{org.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-2">
            <CreateOrganizationDialog setActiveOrg={setActiveOrg} />
          </div>
        </div>

        {/* Members Section */}
        <div className="flex flex-wrap items-start justify-between gap-2 border-t py-4">
          <div className="flex w-full flex-col gap-2">
            <span className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" /> Members
            </span>
            <div className="space-y-3">
              {activeOrg?.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={member.user.image ?? undefined}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {member.user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">{member.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  {member.role !== "owner" &&
                    (currentMember?.role === "owner" ||
                      currentMember?.role === "admin") && (
                      <LoadingButton
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveMember(member.id)}
                        isLoading={isRemoving.includes(member.id)}
                      >
                        {currentMember?.id === member.id ? "Leave" : "Remove"}
                      </LoadingButton>
                    )}
                </div>
              ))}

              {!activeOrg?.id && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image ?? undefined} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-sm">{user.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      Owner
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invitations Section */}
        <div className="flex flex-wrap items-start justify-between gap-2 border-t py-4">
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" /> Invitations
              </span>
              <InviteMemberDialog
                setActiveOrg={setActiveOrg}
                activeOrg={activeOrg}
              />
            </div>
            <div className="space-y-3">
              {activeOrg?.invitations.filter(
                (invitation) => invitation.status === "pending",
              ).length ? (
                activeOrg?.invitations
                  .filter((invitation) => invitation.status === "pending")
                  .map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm">{invitation.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {invitation.role}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <LoadingButton
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCancelInvitation(invitation.id)}
                          isLoading={isRevoking.includes(invitation.id)}
                        >
                          Revoke
                        </LoadingButton>
                        <CopyButton
                          textToCopy={`${typeof window !== "undefined" ? window.location.origin : ""}/accept-invitation/${invitation.id}`}
                        />
                      </div>
                    </div>
                  ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  No active invitations
                </span>
              )}

              {!activeOrg?.id && (
                <span className="text-xs text-muted-foreground">
                  You can&apos;t invite members to your personal workspace.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Danger Zone - Delete Organization */}
        {activeOrg?.id && currentMember?.role === "owner" && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-4">
            <div className="mb-3 flex items-center">
              <span className="text-sm font-semibold text-destructive">
                DANGER ZONE
              </span>
            </div>

            <div className="mb-4 space-y-2">
              <h4 className="text-sm font-medium">Delete Organization</h4>
              <p className="text-xs text-muted-foreground">
                Once you delete this organization, there is no going back. This
                action is permanent and will remove all organization data from
                our systems.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <LoadingButton
                variant="destructive"
                onClick={handleDeleteOrganization}
                className="w-full"
                isLoading={isLoading}
              >
                <Trash className="mr-2 h-4 w-4" />
                Permanently Delete Organization
              </LoadingButton>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrganizationCard;
