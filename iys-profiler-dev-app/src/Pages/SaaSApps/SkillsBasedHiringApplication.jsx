'use client';

import Link from 'next/link';
import ExperiencePlugin from '../../Componet/ExperiencePlugin';
import Newsletter from '../../Componet/Newsletter';
import AlterContent from '../../Componet/SaasApps/SkillsBasedHiringApplication/AlterContent';
import Herosection from '../../Componet/SaasApps/SkillsBasedHiringApplication/Herosection';

const SkillsBasedHiringApplication = () => (
  <div className="page-content">
    <Herosection />
    <AlterContent />
    <ExperiencePlugin />
    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-12">
            <div className="mb-5 text-cente">
              <h4 className="lh-base">
                Useful Links: <br />
                <Link href="/skills-taxonomy-and-profiler">
                  Check out Sample Skills Profiles{' '}
                </Link>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Newsletter title="Interested in the Skills Based Hiring application from IYS?" />
  </div>
);

export default SkillsBasedHiringApplication;
