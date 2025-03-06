import Link from "next/link";

import AppLogoIcon from "../app-logo-icon";

const Logo = () => (
  <Link
    href="/"
    className="flex items-center space-x-2 transition-transform duration-200 ease-in-out hover:scale-105"
  >
    {/* <Image
      src="/favicon-light.svg"
      alt="ProjectHub Logo"
      width={40}
      height={40}
      className="dark:hidden"
    />
    <Image
      src="/favicon-dark.svg"
      alt="ProjectHub Logo"
      width={40}
      height={40}
      className="hidden dark:block"
    /> */}
    <AppLogoIcon />
    <span className="text-xl font-bold">
      <span className="text-primary">Hy</span>Pro
    </span>
  </Link>
);

export default Logo;
