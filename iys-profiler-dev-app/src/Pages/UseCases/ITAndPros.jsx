import Link from 'next/link';
import Newsletter from '../../Componet/Newsletter';
import AlterContent from '../../Componet/UseCases/ITAndPros/AlterContent';
import Benefits from '../../Componet/UseCases/ITAndPros/Benefits';
import Herosection from '../../Componet/UseCases/ITAndPros/Herosection';

import '@/assets/css/customCss.css';

const ITAndPros = () => (
  <>
    <Herosection />
    <AlterContent />
    <Benefits />
    <section>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12">
            <h3 className="lh-base">Interested in Knowing More?</h3>
            <p className="lead lh-lg font-w-5">
              Here are some links that could be useful 
            </p>
            <blockquote className="mb-0">
              <p className="lead mb-4 lh-lg">
                <Link href="/skills-taxonomy-and-profiler">
                  About Skills Taxonomy
                </Link>
                <br />
                <Link href="/experience-iys-skills-profiler">
                  Experience Skills Profiler
                </Link>
                <br />
                <Link href="/saas-application/employee-skills-management">
                  Employee Skills Management Application
                </Link>
                <br />
                <Link href="/saas-application/skills-based-hiring-application">
                  Skills Based Hiring Application
                </Link>
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
    <Newsletter title="Would you like to discuss how IYS can help your professional services company?" />
  </>
);

export default ITAndPros;
