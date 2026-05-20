"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./common/checkAuth";
import CreateSkillsProfile from "@/components/Authforms/CreateSkillsProfile";

const HomeLayout = () => {
  const { tokens } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (tokens) {
      router.push("/create-skill-profile");
    }
  }, [tokens, router]);

  return (
    <div className="min-h-screen">
      {!tokens && <CreateSkillsProfile />}
    </div>
  );
};

export default HomeLayout;
