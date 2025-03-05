import Link from "next/link";

import { Frown } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 px-4 py-8 text-center">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
        404 | Page Not Found
      </h1>
      <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
        The page you&apos;re looking for does not exist.
      </h2>
      <p className="text-lg md:text-xl">
        You must have typed in a wrong address or the page was removed. Try
        again or{" "}
        <Link href="/" className="text-primary hover:underline">
          return to the home page
        </Link>{" "}
        or{" "}
        <Link href="/dashboard" className="text-primary hover:underline">
          dashboard
        </Link>
        .
      </p>
      <Frown className="h-16 w-16 text-primary md:h-32 md:w-32" />
    </div>
  );
};

export default NotFound;
