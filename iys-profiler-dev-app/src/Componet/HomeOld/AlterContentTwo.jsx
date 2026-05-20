// import esmSolution from '../../assets/images/alterImages/esmSolution.png';
import completeSolution from '../../assets/images/alterImages/completeSolution.png';
import grades from '../../assets/images/alterImages/grades.png';
import profilerPlugin from '../../assets/images/alterImages/profillerPlugin.png';
import consult from '../../assets/images/alterImages/consult.png';

const AlterContentTwo = () => (
  <>
    <section className="py-5 my-5">
      <div className="container">
        <div className="text-center">
          <div className="col-8 mx-auto">
            <div className="mb-5">
              <h2 className="lh-base">
                For Organizations across industries and sizes
              </h2>
              <p className="lead mb-4 lh-lg">
                Every business leader, people manager and HR personnel
                appreciates the need for effective skills management, yet it
                remain elusive. Reasons - Skills Data is a challenge, HR
                appreciates Soft Skills but not so much the Hard skills, lack of
                good solutions on skills management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* one */}
    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-start">
            <img
              src={completeSolution.src}
              alt="Image1"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-12 col-lg-5">
            <div className="mb-5">
              <h2 className="lh-base">Complete Skills Management Solution</h2>
              <div className="lead mb-4 lh-lg">
                IYS offers organizaitons for skills management:
                <ul>
                  <li>SAAS Application</li>
                  <li>Consulting Services</li>
                  <li>Technology Tools</li>
                </ul>{' '}
                <p>Backed by No 1 Skills Taxonomy and Profiler</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column-reverse flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-5">
            <div className="mb-5">
              <h2 className="lh-base">
                Orgasnization Skills Management (OSM) SAAS Application
              </h2>
              <p className="lead mb-4 lh-lg">
                A simple yet powerful application with built-in Skills Taxonomy,
                that enables skills profiling of employees, that of roles,
                skills analytics, resource planning, skills gap analysis, skills
                mapping of candidates in recruitment, career planning and more.
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-end">
            <img
              src={grades.src}
              alt="Image1"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </div>
    </section>

    {/* two */}
    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-start">
            <img
              src={profilerPlugin.src}
              alt="Image1"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-12 col-lg-5">
            <div className="mb-5">
              <h2 className="lh-base">
                Skills Taxonomy API, Skills Profiler Plugin
              </h2>
              <p className="lead mb-4 lh-lg">
                For organizations having their HR systems, Skills Enablement is
                now made possible with IYS Skills Taxonomy API and SKills
                Profiler plugin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column-reverse flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-5">
            <div className="mb-5">
              <h2 className="lh-base">Skills Management Consulting Services</h2>
              <p className="lead mb-4 lh-lg">
                We realise that organizations and HR will need help in getting
                skills-centric in a way that is contextually tailored to the
                specific organizations. And thus our consulting services.
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-end">
            <img
              src={consult.src}
              alt="Image1"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </div>
    </section>
  </>
);

export default AlterContentTwo;
