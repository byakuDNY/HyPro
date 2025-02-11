import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

import envConfig from "@/lib/env-config";

const Welcome = ({ name }: { name: string }) => {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Welcome to HyPro!</Preview>
        <Body className="bg-gray-200 p-5">
          <Container className="rounded-lg bg-white p-5">
            <Heading className="text-center text-gray-800">
              Welcome, {name}!
            </Heading>
            <Text className="text-gray-600">
              We’re excited to have you on board. Get ready to explore amazing
              features and be part of our growing community.
            </Text>
            <Button
              href={`${envConfig().baseUrl}/sign-in`}
              className="rounded-md bg-blue-500 px-4 py-2 text-white no-underline"
            >
              Get Started
            </Button>
            {/* <Text className="mt-5 text-gray-500">
              If you have any questions, feel free to reach out to our support
              team.
            </Text> */}
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default Welcome;
