import employeeSkillsImg from '../../../assets/images/alterImages/employeeSkills.png';
import esmSolution from '../../../assets/images/alterImages/esmSolution.png';
import skillsProfiler from '../../../assets/images/alterImages/hiring.png';

const AlterContent = () => (
    <>
      {/* one */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
            <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-start">
              <img
                src={employeeSkillsImg.src}
                alt="Image1"
                className="img-fluid rounded"
              />
            </div>
            <div className="col-12 col-lg-5">
              <div className="mb-5">
                <h2 className="lh-base">Problem</h2>
                <p className="lead mb-4 lh-lg">
                  Every organization and person in the organization appreciates
                  the value of skills, skills being the currency of today’s
                  economy. Decisions in HR and business revolve around skills
                </p>
                <p className="lead mb-4 lh-lg">
                  <u>
                    Yet unlike people managing skills is tough, given the nature
                    of the skills.
                  </u>
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
                <h2 className="lh-base">Solution</h2>
                <p className="lead mb-4 lh-lg">
                  IYS offers organizations a simple yet powerful smart SAAS
                  application for managing skills of employees.
                </p>
                <p className="lead mb-4 lh-lg">
                  It is one of its kind. The smartness of IYS SAAS application
                  comes from the “IYS Skills Profiler” embedded in the
                  application.
                </p>
              </div>
            </div>
            <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-end">
              <img
                src={esmSolution.src}
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
                src={skillsProfiler.src}
                alt="Image1"
                className="img-fluid rounded"
              />
            </div>
            <div className="col-12 col-lg-5">
              <div className="col-12">
                <h1 className="mb-4 font-w-4">
                  <span className="font-w-6">IYS</span>{' '}
                  <span className="font-w-6 text-primary">Skills Profiler</span>
                </h1>
                <p className="lead mb-4 lh-lg">
                  IYS Skills Profiler enables mapping of skills of people and of
                  jobs in a comprehensive manner covering all aspects of talent
                  including knowledge, tools, activities, domain knowledge and
                  more. in a simple and intuitive manner
                </p>
                <p className="lead mb-4 lh-lg">
                  IYS Skills Profiler is backed by a rich and most exhaustive
                  skills taxonomy that is constantly updated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )

export default AlterContent;
