import ExperiencePlugin from '../Componet/ExperiencePlugin';
import Newsletter from '../Componet/Newsletter';
import AlterContent from '../Componet/SkillsProfiler/AlterContent';
import Benefits from '../Componet/SkillsProfiler/Benefits';
import Herosection from '../Componet/SkillsProfiler/Herosection';

const SkillsProfiler = () => (
  <>
    <Herosection />
    <AlterContent />
    <ExperiencePlugin />
    <Benefits />
    <Newsletter title="Interested? What to know more?" />
  </>
);

export default SkillsProfiler;
