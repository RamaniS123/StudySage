import { shadow } from "@/styles/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";

function Header() {
  const user = null;

  return (
    <header
      className="bg-popover relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{
        boxShadow: shadow,
      }}
    >
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/StudySage (2).png"
          height={90}
          width={100}
          alt="logo"
          className="rounded-full"
          priority
        />
        <h1 className="flex flex-col text-2xl leading-6 font-semibold">
          Study <span>Sage</span>
        </h1>
      </Link>

      <div className="flex gap-4">
        {user ? (
          "Logout"
        ) : (
          <>
            <Button asChild>
              <Link href="/sign-up" className="hidden sm:block">
                Sign Up
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}

export default Header;
