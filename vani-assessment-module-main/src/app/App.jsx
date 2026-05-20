import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndividualHomePage from "./page.jsx";
import RecruiterInterviewPage from "./interview/[token]/index.jsx";
import SkillsPage from "./skills/page.jsx";
import SkillsInterviewPage from "./skills/interview/[token]/page.jsx";
import JobfitPage from "./jobfit/page.jsx";
import JobfitInterviewPage from "./jobfit/interview/[token]/page.jsx";
import JobfitLoginPage from "./jobfit/login/page.jsx";
import JobfitRegisterPage from "./jobfit/register/page.jsx";
import JobfitDashboardPage from "./jobfit/dashboard/page.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndividualHomePage />} />
        <Route path="/interview/:token" element={<RecruiterInterviewPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/skills/interview/:token" element={<SkillsInterviewPage />} />
        <Route path="/jobfit" element={<JobfitPage />} />
        <Route path="/jobfit/interview/:token" element={<JobfitInterviewPage />} />
        <Route path="/jobfit/login" element={<JobfitLoginPage />} />
        <Route path="/jobfit/register" element={<JobfitRegisterPage />} />
        <Route path="/jobfit/dashboard" element={<JobfitDashboardPage />} />
      </Routes>
    </Router>
  );
}