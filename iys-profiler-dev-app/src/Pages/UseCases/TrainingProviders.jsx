import Newsletter from '../../Componet/Newsletter';
import AlterContent from '../../Componet/UseCases/TrainingProviders/AlterContent';
import Herosection from '../../Componet/UseCases/TrainingProviders/Herosection';

import '@/assets/css/customCss.css';

const TrainingProviders = () => (
  <>
    <Herosection />
    <AlterContent />
    <Newsletter title="Interested in boosting your training function or business?" />
  </>
);

export default TrainingProviders;
