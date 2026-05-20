"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/rounded";
import { API } from "../../app/auth/endpoints";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  let storedSidebarExpanded = "true";

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  );
  const [profileOpen, setProfileOpen] = useState(true);
  const [messageOpen, setMessageOpen] = useState(true);
  const [shareId, setShareId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  //Profile Menu Get the Profile Id 
  useEffect(() => {
    const apiEndpoint = `${API.getSkills}`;

    const makeApiRequest = async () => {
      const token = JSON.parse(localStorage.getItem("tokenData") || "{}").access;
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      try {
        const response = await fetch(apiEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const shareIdFromResponse = data.share_id;
        const encodedId = btoa(shareIdFromResponse);
        setShareId(encodedId);
        setIsAuthenticated(true);
        // setShareId(shareIdFromResponse);
      } catch (error: any) {
        console.error("Error making API request:", error.message);
        setIsAuthenticated(false);
        router.push('/auth/signin');
      }
    };
    makeApiRequest();
  }, [router]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  //Active nav-link is stored to the localstorage using plugin changes
  useEffect(() => {
    const getActiveNavName = (path: string) => {
      if (path === "/" || path.includes("dashboard")) return "Home";
      if (path === "/export") return "Export";
      if (path.includes("request-360-feedback") || path.includes("view-360-feedback")) return "Feedback";
      return "Profile";
    };

    const activeNavName = getActiveNavName(pathname);
    if (activeNavName !== null) {
      localStorage.setItem("activeNav", activeNavName);
    } else {
      localStorage.removeItem("activeNav");
    }
  }, [pathname]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-full flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark md:w-72.5 lg:static lg:translate-x-0 print:hidden ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/" className="flex w-full items-center gap-3">
          <img
            width={32}
            height={32}
            src={"/images/logo/myskillspluslogo.png"}
            alt="Logo"
          />
          <b className="text-xl text-white">MySkillsPlus</b>
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Home --> */}
              {/* <li>
                <Link
                  href="/"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    (pathname === "/" || pathname.includes("dashboard")) &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <MaterialSymbol icon="home" size={24} />
                  Home
                </Link>
              </li> */}
              {/* <!-- Menu Item My Profile --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname.includes("create-skill-profile") || pathname.includes("personal-background-profile") || pathname.includes("work-preference") || pathname.includes("vsp-and-others")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname.includes("create-skill-profile") || 
                            pathname.includes("personal-background-profile") || 
                            pathname.includes("work-preference") || 
                            pathname.includes("vsp-and-others")) &&
                          "bg-graydark dark:bg-meta-4"
                        } ${localStorage.getItem("tokenData") ? "" : "text-slate-500"}`}
                        onClick={(e) => {
                          e.preventDefault();
                          localStorage.getItem("tokenData") && sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        {localStorage.getItem("tokenData") ? (
                          <MaterialSymbol icon="account_circle" size={24} />
                        ) : (
                          <MaterialSymbol icon="lock" size={24} />
                        )}
                        My Profile
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && "rotate-180"
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </Link>
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/create-skill-profile"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "/create-skill-profile" && "text-white"
                              }`}
                            >
                              Personal Skills Profile
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/personal-background-profile"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "/personal-background-profile" && "text-white"
                              }`}
                            >
                              Personal Background Profile
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/work-preference"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "/work-preference" && "text-white"
                              }`}
                            >
                              Work Preference
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/vsp-and-others"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "/vsp-and-others" && "text-white"
                              }`}
                            >
                              VSP and Others
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/assessment-history"                              
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                              pathname === "/assessment-history" && "text-white"
                              }`}
                            >
                              Assessment History
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Messages --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname.includes("notifications") || pathname.includes("messages")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname.includes("notifications") || 
                            pathname.includes("messages")) &&
                          "bg-graydark dark:bg-meta-4"
                        } ${localStorage.getItem("tokenData") ? "" : "text-slate-500"}`}
                        onClick={(e) => {
                          e.preventDefault();
                          localStorage.getItem("tokenData") && sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        {localStorage.getItem("tokenData") ? (
                          <MaterialSymbol icon="message" size={24} />
                        ) : (
                          <MaterialSymbol icon="lock" size={24} />
                        )}
                        Messaging
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && "rotate-180"
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </Link>
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/notifications"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "/notifications" && "text-white"
                              }`}
                            >
                              Notifications
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/messages"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "/messages" && "text-white"
                              }`}
                            >
                              Messages
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Export --> */}
              <li>
                <Link
                  href="/export"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname === "/export" && "bg-graydark dark:bg-meta-4"
                  } ${localStorage.getItem("tokenData") ? "" : "text-slate-500"}`}
                >
                  {localStorage.getItem("tokenData") ? (
                    <MaterialSymbol icon="download" size={24} />
                  ) : (
                    <MaterialSymbol icon="lock" size={24} />
                  )}
                  Export
                </Link>
              </li>
              {/* <!-- Menu Item 360 Feedback --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname.includes("request-360-feedback") || pathname.includes("view-360-feedback")
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname.includes("request-360-feedback") ||
                            pathname.includes("view-360-feedback")) &&
                          "bg-graydark dark:bg-meta-4"
                        } ${localStorage.getItem("tokenData") ? "" : "text-slate-500"}`}
                        onClick={(e) => {
                          e.preventDefault();
                          localStorage.getItem("tokenData") && sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        {localStorage.getItem("tokenData") ? (
                          <MaterialSymbol icon="360" size={24} />
                        ) : (
                          <MaterialSymbol icon="lock" size={24} />
                        )}
                        360º Feedback
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && "rotate-180"
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </Link>
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link
                              href="/request-360-feedback"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "/request-360-feedback" && "text-white"
                              }`}
                            >
                              Request Feedback
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/view-360-feedback"
                              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                                pathname === "/view-360-feedback" && "text-white"
                              }`}
                            >
                              View Feedback
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <li>
                <Link
                  href="#" onClick={(e) => {
                    e.preventDefault(); // Prevent default link behavior
                    if (!isAuthenticated) {
                      router.push('/auth/signin'); // Redirect to sign-in page if not authenticated
                    } else if (shareId) {
                      router.push(`/profile/${shareId}`); // Navigate to the profile page if authenticated
                    }
                  }}
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname === `/profile/${shareId}` && "bg-graydark dark:bg-meta-4"
                  } ${localStorage.getItem("tokenData") ? "" : "text-slate-500"}`}
                >
                {localStorage.getItem("tokenData") ? (
                    <MaterialSymbol icon="account_circle" size={24} />
                  ) : (
                    <MaterialSymbol icon="lock" size={24} />
                  )}
                My Skills Profile
                </Link>
              </li>
              {/* <!-- Menu Item Profile --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
