import Link from "next/link";

import { Frown } from "lucide-react";

const NotFound = () => {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-3 py-8">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Page Not Found
      </h1>
      <div className="">
        <h2 className="scroll-m-20 text-balance border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          The page you're looking for does not exist.
        </h2>
      </div>
      <p className="max-w-xl">
        You must have typed in a wrong address or the page was removed, in the
        meantime try again or{" "}
        <Link
          href={"/"}
          className="inline-block text-primary transition-transform duration-200 ease-in-out hover:scale-95"
        >
          return to the home page
        </Link>
        .
      </p>
      <Frown className="h-16 w-16 text-primary" />
    </div>
  );
};

export default NotFound;
