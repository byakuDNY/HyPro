import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  username?: string;
  resetLink?: string;
}

const ResetPasswordEmail = ({
  username,
  resetLink,
}: ResetPasswordEmailProps) => {
  const previewText = `Reset your Hypro password`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#fafafa] font-sans">
          <Container className="mx-auto my-8 max-w-[500px]">
            {/* Header with Logo */}
            <Section className="rounded-t-[0.5rem] bg-white px-8 pt-8 text-center">
              <Section className="mx-auto text-center">
                <Text className="m-0 text-xl font-bold">
                  <span className="text-[#e11d48]">Hy</span>Pro
                </Text>
              </Section>
            </Section>

            {/* Main Content */}
            <Section className="rounded-b-[0.5rem] bg-white px-8 pb-8">
              <Heading className="mb-6 mt-4 text-center text-2xl font-bold text-[#0c0a09]">
                Reset your password
              </Heading>

              <Text className="mb-4 text-base text-[#262626]">
                Hello {username},
              </Text>

              <Text className="mb-6 text-base text-[#262626]">
                We received a request to reset your password for your Hypro
                account. Use the button below to set up a new password. If you
                didn&apos;t make this request, you can safely ignore this email.
              </Text>

              {/* CTA Button */}
              <Section className="mb-8 text-center">
                <Button
                  className="rounded-[0.5rem] bg-[#e11d48] px-6 py-3 text-center text-base font-medium text-white no-underline"
                  href={resetLink}
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="mb-6 text-sm text-[#737373]">
                Or copy and paste this URL into your browser:{" "}
                <Link href={resetLink} className="text-[#e11d48] no-underline">
                  {resetLink}
                </Link>
              </Text>

              <Hr className="mb-6 border-[#e6e6e6]" />

              <Text className="text-xs text-[#a3a3a3]">
                If you didn&apos;t request a password reset, please ignore this
                email or contact our support team if you have any concerns about
                your account security.
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

export default ResetPasswordEmail;
