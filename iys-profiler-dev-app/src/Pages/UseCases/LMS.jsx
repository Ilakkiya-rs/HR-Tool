import ExperiencePlugin from '../../Componet/ExperiencePlugin';
import Newsletter from '../../Componet/Newsletter';
import AlterContent from '../../Componet/UseCases/LMS/AlterContent';
import Benefits from '../../Componet/UseCases/LMS/Benefits';
import Herosection from '../../Componet/UseCases/LMS/Herosection';
import Outcomes from '../../Componet/UseCases/LMS/Outcomes';

import '@/assets/css/customCss.css';

const LMS = () => (
  <>
    <Herosection />
    <AlterContent />
    <ExperiencePlugin />
    <Benefits />
    <Outcomes />
    <Newsletter title="Excited to boost your LMS?" />
  </>
);

export default LMS;
