import Link from "next/link";
import { useState } from "react";
import DropdownUser from "./DropdownUser";
import { useAuth } from "../common/checkAuth";
import { usePathname } from "next/navigation";

const Header = (props: { sidebarOpen: string | boolean | undefined }) => {
  const { tokens } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  const isActive = (path: string, defaultPath = false) => {
    if (pathname === path) return true;
    if (defaultPath && (pathname === "/" || pathname.startsWith("/create-your-skills-profile"))) {
      return true;
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white drop-shadow-md dark:bg-boxdark print:hidden">
      <div className="flex items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          <img
            src="/images/logo/myskillspluslogo.png"
            alt="Logo"
            width="32"
            height="32"
          />
          <b className="text-xl">My Skills Plus</b>
        </div>

        <button
          className="block md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <nav
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full bg-white drop-shadow-md md:static md:block md:w-auto md:bg-transparent md:drop-shadow-none`}
        >
          <div className="flex flex-col md:flex-row lg:items-center md:items-center mb-4 lg:mb-0 md:mb-0 gap-3 2xsm:gap-7 px-4 md:px-0">
            {tokens ? (
              <DropdownUser />
            ) : (
              <>
                <Link
                  href="/create-your-skills-profile"
                  className={`inline-flex items-center justify-center rounded-full border border-primary px-4 py-2 text-primary hover:bg-opacity-90 ${
                    isActive("/create-your-skills-profile", true)
                      ? "bg-primary text-white"
                      : ""
                  }`}
                >
                  Create Skills Profile
                </Link>
                <Link
                  href="/auth/signup"
                  className={`inline-flex items-center justify-center rounded-full border border-primary px-4 py-2 text-primary hover:bg-opacity-90 ${
                    isActive("/auth/signup") ? "bg-primary text-white" : ""
                  }`}
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/signin"
                  className={`inline-flex items-center justify-center rounded-full border border-primary px-4 py-2 text-primary hover:bg-opacity-90 ${
                    isActive("/auth/signin") ? "bg-primary text-white" : ""
                  }`}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
