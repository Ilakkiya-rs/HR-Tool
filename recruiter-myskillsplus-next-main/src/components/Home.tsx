"use client";
import { useAuth } from "./common/checkAuth";
import DefaultLayout from "./Layouts/DefaultLayout";
// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
// import CreateSkillsProfile from "./CreateSkillsProfile";
// import ExperienceHomePlugin from "./ExperienceHomePlugin";
import LoginHomePageContent from "./LoginHomePageContent";
import Register from "@/components/Authforms/Register";

const HomeLayout = () => {
  const { tokens } = useAuth();

  return tokens ? (
    <DefaultLayout>
      {/* <Breadcrumb pageName="Job Skills Profile" /> */}
      {/* <ExperienceHomePlugin /> */}
      <LoginHomePageContent />
    </DefaultLayout>
  ) : (
    <div className="min-h-screen">
      {/* <CreateSkillsProfile /> */}
      <Register />
    </div>
  );
};

export default HomeLayout;
