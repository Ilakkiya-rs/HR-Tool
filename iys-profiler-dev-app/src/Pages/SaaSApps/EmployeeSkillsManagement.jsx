import React from 'react';
import Herosection from '../../Componet/SaasApps/EmployeeSkillsManagement/Herosection';
import AlterContent from '../../Componet/SaasApps/EmployeeSkillsManagement/AlterContent';
import Usecases from '../../Componet/SaasApps/EmployeeSkillsManagement/Usecases';
import ExperiencePlugin from '../../Componet/ExperiencePlugin';
import Outcomes from '../../Componet/SaasApps/EmployeeSkillsManagement/Outcomes';
import Newsletter from '../../Componet/Newsletter';

const EmployeeSkillsManagement = () => (
  <div className="page-content">
    <Herosection />
    <AlterContent />
    <ExperiencePlugin />
    <Usecases />
    <Outcomes />
    <Newsletter />
  </div>
);

export default EmployeeSkillsManagement;
