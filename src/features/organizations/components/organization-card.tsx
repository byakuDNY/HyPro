"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ChevronDownIcon, Loader2, MailPlus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showErrorToast } from "@/hooks/use-error-toast";
import { showLoadingToast } from "@/hooks/use-loading-toast";
import { showSuccessToast } from "@/hooks/use-success-toast";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth/auth-client";
import { type ActiveOrganization, type Session } from "@/lib/auth/types";

import CreateOrganizationDialog from "./create-organization.dialog";

export function OrganizationCard({
  session,
  activeOrganization,
}: {
  session: Session | null;
  activeOrganization: ActiveOrganization | null;
}) {
  const router = useRouter();

  const organizations = authClient.useListOrganizations();
  const [optimisticOrg, setOptimisticOrg] = useState<ActiveOrganization | null>(
    activeOrganization,
  );
  const [isRevoking, setIsRevoking] = useState<string[]>([]);

  const currentMember = optimisticOrg?.members.find(
    (member) => member.userId === session?.user.id,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization</CardTitle>
        <div className="flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center gap-1">
                <span className="text-sm">
                  <span className="font-bold"></span>{" "}
                  {optimisticOrg?.name || "Personal"}
                </span>

                <ChevronDownIcon />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                className="py-1"
                onClick={async () => {
                  authClient.organization.setActive({
                    organizationId: null,
                  });
                  setOptimisticOrg(null);
                }}
              >
                <span className="sm text-sm">Personal</span>
              </DropdownMenuItem>
              {organizations.data?.map((org) => (
                <DropdownMenuItem
                  className="py-1"
                  key={org.id}
                  onClick={async () => {
                    if (org.id === optimisticOrg?.id) {
                      return;
                    }
                    setOptimisticOrg({
                      members: [],
                      invitations: [],
                      ...org,
                    });
                    await authClient.organization.setActive(
                      {
                        organizationId: org.id,
                      },
                      {
                        onSuccess: (ctx) => {
                          showSuccessToast({
                            description: `${ctx.data.name} is now set as the active organization.`,
                          });
                          setOptimisticOrg(ctx.data);
                          router.refresh();
                        },
                        onError: (ctx) => {
                          showErrorToast({
                            description: ctx.error.message,
                          });
                        },
                        onRequest: () => {
                          showLoadingToast({
                            description: "Setting active organization...",
                          });
                        },
                      },
                    );
                  }}
                >
                  <span className="sm text-sm">{org.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <CreateOrganizationDialog />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="rounded-none">
            <AvatarImage
              className="h-full w-full rounded-none object-cover"
              src={optimisticOrg?.logo || ""}
            />
            <AvatarFallback className="rounded-none">
              {optimisticOrg?.name?.charAt(0) || "P"}
            </AvatarFallback>
          </Avatar>
          <div>
            <span>{optimisticOrg?.name || "Personal"}</span>
            <span className="text-xs text-muted-foreground">
              {optimisticOrg?.members.length || 1} members
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-grow flex-col gap-2">
            <span className="border-b-2 border-b-foreground/10 font-medium">
              Members
            </span>
            <div className="flex flex-col gap-2">
              {optimisticOrg?.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9 sm:flex">
                      <AvatarImage
                        src={member.user.image || ""}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {member.user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm">{member.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {member.role}
                      </span>
                    </div>
                  </div>
                  {member.role !== "owner" &&
                    (currentMember?.role === "owner" ||
                      currentMember?.role === "admin") && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          authClient.organization.removeMember({
                            memberIdOrEmail: member.id,
                          });
                        }}
                      >
                        {currentMember?.id === member.id ? "Leave" : "Remove"}
                      </Button>
                    )}
                </div>
              ))}
              {!optimisticOrg?.id && (
                <div>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={session?.user.image || ""} />
                      <AvatarFallback>
                        {session?.user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm">{session?.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Owner
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-grow flex-col gap-2">
            <span className="border-b-2 border-b-foreground/10 font-medium">
              Invites
            </span>
            <div className="flex flex-col gap-2">
              {optimisticOrg?.invitations
                .filter((invitation) => invitation.status === "pending")
                .map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <span className="text-sm">{invitation.email}</span>
                      <span className="text-xs text-muted-foreground">
                        {invitation.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        disabled={isRevoking.includes(invitation.id)}
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          authClient.organization.cancelInvitation(
                            {
                              invitationId: invitation.id,
                            },
                            {
                              onRequest: () => {
                                setIsRevoking([...isRevoking, invitation.id]);
                              },
                              onSuccess: () => {
                                console.log("Invitation revoked successfully");
                                setIsRevoking(
                                  isRevoking.filter(
                                    (id) => id !== invitation.id,
                                  ),
                                );
                                setOptimisticOrg({
                                  ...optimisticOrg,
                                  invitations:
                                    optimisticOrg?.invitations.filter(
                                      (inv) => inv.id !== invitation.id,
                                    ),
                                });
                              },
                              onError: (ctx) => {
                                console.error(ctx.error.message);
                                setIsRevoking(
                                  isRevoking.filter(
                                    (id) => id !== invitation.id,
                                  ),
                                );
                              },
                            },
                          );
                        }}
                      >
                        {isRevoking.includes(invitation.id) ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          "Revoke"
                        )}
                      </Button>
                      <div>
                        <CopyButton
                          textToCopy={`${window.location.origin}/accept-invitation/${invitation.id}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              {optimisticOrg?.invitations.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  No Active Invitations
                </span>
              )}
              {!optimisticOrg?.id && (
                <Label className="text-xs text-muted-foreground">
                  You can&apos;t invite members to your personal workspace.
                </Label>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full justify-end">
          <div>
            <div>
              {optimisticOrg?.id && (
                <InviteMemberDialog
                  setOptimisticOrg={setOptimisticOrg}
                  optimisticOrg={optimisticOrg}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InviteMemberDialog({
  setOptimisticOrg,
  optimisticOrg,
}: {
  setOptimisticOrg: (org: ActiveOrganization | null) => void;
  optimisticOrg: ActiveOrganization | null;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full gap-2" variant="secondary">
          <MailPlus size={16} />
          <span>Invite Member</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Invite a member to your organization.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Label>Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button
              disabled={loading}
              onClick={async () => {
                const invite = authClient.organization.inviteMember({
                  email: email,
                  role: role as "member",
                  fetchOptions: {
                    throw: true,
                    onSuccess: (ctx) => {
                      if (optimisticOrg) {
                        setOptimisticOrg({
                          ...optimisticOrg,
                          invitations: [
                            ...(optimisticOrg?.invitations || []),
                            ctx.data,
                          ],
                        });
                      }
                    },
                  },
                });
                toast({
                  title: "Updating user info...",
                });
              }}
            >
              Invite
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
