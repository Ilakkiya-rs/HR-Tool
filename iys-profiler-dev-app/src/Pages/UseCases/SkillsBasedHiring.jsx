import Newsletter from '../../Componet/Newsletter';
import AlterContent from '../../Componet/UseCases/SkillsBasedHiring/AlterContent';
import Herosection from '../../Componet/UseCases/SkillsBasedHiring/Herosection';

import '@/assets/css/customCss.css';

const SkillsBasedHiring = () => (
  <>
    <Herosection />
    <AlterContent />
    <Newsletter title="Interested in how IYS can help you implement Skill-based Hiring?" />
  </>
);

export default SkillsBasedHiring;
