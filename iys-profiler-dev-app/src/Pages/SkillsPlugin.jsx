import ExperiencePlugin from '../Componet/ExperiencePlugin';
import Newsletter from '../Componet/Newsletter';
import AlterContent from '../Componet/SkillsPlugin/AlterContent';
import Herosection from '../Componet/SkillsPlugin/Herosection';

const SkillsPlugin = () => (
  <>
    <Herosection />
    <ExperiencePlugin />
    <AlterContent />
    <Newsletter title="Interested? What to know more?" />
  </>
);

export default SkillsPlugin;
