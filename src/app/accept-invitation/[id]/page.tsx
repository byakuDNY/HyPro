"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CheckIcon, XIcon } from "lucide-react";

import LoadingUi from "@/components/loading-ui";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth/auth-client";

import InvitationError from "./invitation-error";

const InvitationPage = () => {
  const params = useParams<{
    id: string;
  }>();

  const router = useRouter();
  const [invitationStatus, setInvitationStatus] = useState<
    "pending" | "accepted" | "rejected"
  >("pending");

  const handleAccept = async () => {
    await authClient.organization
      .acceptInvitation({
        invitationId: params.id,
      })
      .then((res) => {
        if (res.error) {
          setError(res.error.message || "An error occurred");
        } else {
          setInvitationStatus("accepted");
          router.push("/organizations");
        }
      });
  };

  const handleReject = async () => {
    await authClient.organization
      .rejectInvitation({
        invitationId: params.id,
      })
      .then((res) => {
        if (res.error) {
          setError(res.error.message || "An error occurred");
        } else {
          setInvitationStatus("rejected");
        }
      });
  };

  const [invitation, setInvitation] = useState<{
    organizationName: string;
    organizationSlug: string;
    inviterEmail: string;
    id: string;
    status: "pending" | "accepted" | "rejected" | "canceled";
    email: string;
    expiresAt: Date;
    organizationId: string;
    role: string;
    inviterId: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authClient.organization
      .getInvitation({
        query: {
          id: params.id,
        },
      })
      .then((res) => {
        if (res.error) {
          setError(res.error.message || "An error occurred");
        } else {
          setInvitation(res.data);
        }
      });
  }, [params.id]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      {invitation ? (
        <Card className="card-container">
          <CardHeader className="card-header">
            <CardTitle>Organization Invitation</CardTitle>
            <CardDescription>
              You&apos;ve been invited to join an organization
            </CardDescription>
          </CardHeader>

          <CardContent>
            {invitationStatus === "pending" && (
              <div className="space-y-4">
                <p>
                  <strong>{invitation?.inviterEmail}</strong> has invited you to
                  join <strong>{invitation?.organizationName}</strong>.
                </p>
                <p>
                  This invitation was sent to{" "}
                  <strong>{invitation?.email}</strong>.
                </p>
              </div>
            )}

            {invitationStatus === "accepted" && (
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-center text-2xl font-bold">
                  Welcome to {invitation?.organizationName}!
                </h2>
                <p className="text-center">
                  You&apos;ve successfully joined the organization. We&apos;re
                  excited to have you on board!
                </p>
              </div>
            )}

            {invitationStatus === "rejected" && (
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <XIcon className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-center text-2xl font-bold">
                  Invitation Declined
                </h2>
                <p className="text-center">
                  You&lsquo;ve declined the invitation to join{" "}
                  {invitation?.organizationName}.
                </p>
              </div>
            )}
          </CardContent>

          {invitationStatus === "pending" && (
            <CardFooter className="flex justify-between">
              <Button variant="secondary" onClick={handleReject}>
                Decline
              </Button>
              <Button onClick={handleAccept}>Accept Invitation</Button>
            </CardFooter>
          )}
        </Card>
      ) : error ? (
        <InvitationError />
      ) : (
        <LoadingUi />
      )}
    </div>
  );
};

export default InvitationPage;
