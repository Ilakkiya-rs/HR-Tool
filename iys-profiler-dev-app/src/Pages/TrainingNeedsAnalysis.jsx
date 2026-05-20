import Newsletter from '../Componet/Newsletter';
import AlterContent from '../Componet/TrainingNeedsAnalysis/AlterContent';
import Herosection from '../Componet/TrainingNeedsAnalysis/Herosection';

import '@/assets/css/customCss.css';

const SkillsGapAnalysis = () => (
  <>
    <Herosection />
    <AlterContent />
    <Newsletter title="Don&apos;t let skills gaps hold your organization back. Connect with us now to elevate your training initiatives and empower your workforce for success!" />
    <section>
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
            <div className="text-center">
              <div className="row text-center">
                <div className="col-md-6 col-lg-9 mx-auto">
                  <div className="lead lh-lg text-center">
                    <p className="text-center">
                        Effective <b className="fw-bold">Training Needs Analysis</b> and <b className="fw-bold">Training Needs Assessment</b> are essential for driving organizational success. By leveraging the capabilities of IYS Skills Tech’s Organization Skills Management application, you can ensure that your training efforts are impactful, targeted, and aligned with your business objectives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  </>
);

export default SkillsGapAnalysis;
