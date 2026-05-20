'use client';

import Newsletter from '@/Componet/Newsletter';
import AlterContent from "@/Componet/SaasApps/OrganizationSkillsManagement/AlterContent"
import Herosection from '@/Componet/SaasApps/OrganizationSkillsManagement/Herosection';

const OrganizationSkillsManagement = () => {
  return (
    <>
      <Herosection />
      <div className="page-content">
        {/* <Usecases /> */}
        <AlterContent />
        <Newsletter />
      </div>
    </>
  )
}

export default OrganizationSkillsManagement;