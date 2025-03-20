import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import envConfig from "@/lib/env-config";

const Welcome = ({ name }: { name: string }) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Hypro!</Preview>
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
                Welcome, {name}!
              </Heading>

              <Text className="mb-6 text-base text-[#262626]">
                We&apos;re excited to have you on board. Get ready to explore
                amazing features and be part of our growing community.
              </Text>

              {/* CTA Button */}
              <Section className="mb-8 text-center">
                <Button
                  href={`${envConfig().baseUrl}/dashboard`}
                  className="rounded-[0.5rem] bg-[#e11d48] px-6 py-3 text-center text-base font-medium text-white no-underline"
                >
                  Get Started
                </Button>
              </Section>

              <Text className="mb-6 text-base text-[#262626]">
                Your account has been created successfully and you&apos;re ready
                to start using Hypro. Explore our platform and discover how we
                can help streamline your workflow.
              </Text>

              <Hr className="mb-6 border-[#e6e6e6]" />

              <Text className="text-xs text-[#a3a3a3]">
                If you have any questions, feel free to reach out to our support
                team at support@hypro.com.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="mt-4 text-center">
              <Text className="text-xs text-[#a3a3a3]">
                {`© 2025${new Date().getFullYear() > 2025 ? `-${new Date().getFullYear()}` : ""} Hypro. All rights reserved.`}
              </Text>
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

export default Welcome;
