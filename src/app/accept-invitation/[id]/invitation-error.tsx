import Link from "next/link";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const InvitationError = () => {
  return (
    <Card className="card-container">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <CardTitle className="text-destructive">Invalid Invitation</CardTitle>
        </div>
        <CardDescription>
          There was an issue with your invitation.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground">
          The invitation you&apos;re trying to access is either invalid or you
          don&apos;t have the correct permissions. Please check your email for a
          valid invitation or contact the person who sent it.
        </p>
      </CardContent>

      <CardFooter>
        <Link href="/" className="w-full" prefetch>
          <Button variant="outline" className="w-full">
            Go back to home
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default InvitationError;
