import Newsletter from '../../Componet/Newsletter';
import AlterContent from '../../Componet/UseCases/SkillsGapAnalysis/AlterContent';
import Herosection from '../../Componet/UseCases/SkillsGapAnalysis/Herosection';

import '@/assets/css/customCss.css';

const SkillsGapAnalysis = () => (
  <>
    <Herosection />
    <AlterContent />
    <Newsletter title="Interested in embarking on a data-driven skills gap analysis?" />
  </>
);

export default SkillsGapAnalysis;
