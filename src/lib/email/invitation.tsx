import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface InvitationEmailProps {
  username?: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
  teamName?: string;
  teamImage?: string;
  inviteLink?: string;
}

const InvitationEmail = ({
  username,
  invitedByUsername,
  invitedByEmail,
  teamName,
  teamImage,
  inviteLink,
}: InvitationEmailProps) => {
  const previewText = `${invitedByUsername} invited you to join ${teamName} on Hypro`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#fafafa] font-sans">
          <Container className="mx-auto my-8 max-w-[500px]">
            {/* Header with Logo */}
            <Section className="rounded-t-[0.5rem] bg-white px-8 pt-8 text-center">
              <Row>
                <Column>
                  {/* Email-friendly logo version */}
                  <Section className="mx-auto text-center">
                    <Text className="m-0 text-xl font-bold">
                      <span className="text-[#e11d48]">Hy</span>Pro
                    </Text>
                  </Section>
                </Column>
              </Row>
            </Section>

            {/* Main Content */}
            <Section className="rounded-b-[0.5rem] bg-white px-8 pb-8">
              <Heading className="mb-6 mt-4 text-center text-2xl font-bold text-[#0c0a09]">
                You&apos;ve been invited to join a team
              </Heading>

              {/* Team Info */}
              <Section className="mb-6 rounded-[0.5rem] bg-[#f5f5f4] p-4 text-center">
                {teamImage && (
                  <Img
                    src={teamImage}
                    width="64"
                    height="64"
                    alt={teamName || "Team"}
                    className="mx-auto mb-2 rounded-full border-2 border-[#e6e6e6]"
                  />
                )}
                <Text className="mb-1 text-lg font-bold text-[#0c0a09]">
                  {teamName}
                </Text>
                <Text className="text-sm text-[#737373]">
                  Invited by {invitedByUsername} ({invitedByEmail})
                </Text>
              </Section>

              <Text className="mb-6 text-base text-[#262626]">
                Hi{username ? ` ${username}` : ""},
              </Text>

              <Text className="mb-6 text-base text-[#262626]">
                <strong>{invitedByUsername}</strong> has invited you to
                collaborate on the <strong>{teamName}</strong> team on Hypro.
                Join now to start working together!
              </Text>

              {/* CTA Button */}
              <Section className="mb-8 text-center">
                <Button
                  className="rounded-[0.5rem] bg-[#e11d48] px-6 py-3 text-center text-base font-medium text-white no-underline"
                  href={inviteLink}
                >
                  Accept Invitation
                </Button>
              </Section>

              <Text className="mb-6 text-sm text-[#737373]">
                Or copy this link into your browser:{" "}
                <Link href={inviteLink} className="text-[#e11d48] no-underline">
                  {inviteLink}
                </Link>
              </Text>

              <Hr className="mb-6 border-[#e6e6e6]" />

              <Text className="text-xs text-[#a3a3a3]">
                If you weren&apos;t expecting this invitation, you can safely
                ignore this email. If you have any questions, please contact
                support@hypro.com.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="mt-4 text-center">
              <Text className="text-xs text-[#a3a3a3]">
                {`© 2025${new Date().getFullYear() > 2025 ? `-${new Date().getFullYear()}` : ""} Hypro. All rights reserved.`}
              </Text>
              {/* <Text className="text-xs text-[#a3a3a3]">
                123 Startup Way, San Francisco, CA 94107
              </Text> */}
              <Text className="text-xs text-[#a3a3a3]">
                This is an automated email, please do not reply.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InvitationEmail;
