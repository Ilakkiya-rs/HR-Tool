import '@/assets/css/customCss.css';

import AlterContent from '../../Componet/UseCases/JobPortal/AlterContent';
import Herosection from '../../Componet/UseCases/JobPortal/Herosection';
import Newsletter from '../../Componet/Newsletter';

const JobPortal = () => (
  <>
    <Herosection />
    <AlterContent />
    <Newsletter title="Interested in Boosting Your Recruitment Application?" />
  </>
);

export default JobPortal;
