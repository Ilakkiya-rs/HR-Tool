import lmsProblemImg from '../../../assets/images/alterImages/lmsProblem.png';
import lmsSolutionImg from '../../../assets/images/alterImages/lmsSolution.png';
import skillsProfilerImg from '../../../assets/images/alterImages/hiring.png';
import partnerImg from '../../../assets/images/alterImages/partner.png';

const AlterContent = () => (
    <>
      {/* one */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
            <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-start">
              <img
                src={lmsProblemImg.src}
                alt="Image1"
                className="img-fluid rounded"
              />
            </div>
            <div className="col-12 col-lg-5">
              <div className="mb-5">
                <h2 className="lh-base">Problem</h2>
                <p className="lead mb-4 lh-lg">
                  Most Learning Management systems pitch on the number of
                  courses they offer. Something like (not in exact words)
                </p>
                <p className="lead mb-4 lh-lg">
                  <i>“Explore over 1,000 training courses”</i>
                </p>
                <p className="lead mb-4 lh-lg">
                  But this is not good enough in today’s world of hyper
                  personalization. People would like to see from your Learning
                  Management system
                </p>
                <p className="lead mb-4 lh-lg">
                  <u>
                    “Here are 5 training courses that will boost your career”
                  </u>
                </p>
                <p className="lead mb-4 lh-lg">
                  Recommendations tailored for the user.
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
                  Your LMS can deliver this value if you understand the “skills
                  profile” of your users. Every user is different. It will
                  immensely benefit if you understand each one’s skills profile
                  and make recommendations picking the right few courses from
                  your repository of courses to them.
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
                src={lmsSolutionImg.src}
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
                src={skillsProfilerImg.src}
                alt="Image1"
                className="img-fluid rounded"
              />
            </div>
            <div className="col-12 col-lg-5">
              <div className="col-12">
                <h2 className="mb-4 font-w-4">
                  <span className="font-w-6">IYS</span>{' '}
                  <span className="font-w-6 text-primary">Skills Profiler</span>
                </h2>
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

      <section className="py-5 my-5">
        <div className="container">
          <div className="d-flex flex-column-reverse flex-lg-row align-items-center justify-content-between">
            <div className="col-12 col-lg-5">
              <div className="mb-5">
                <h2 className="lh-base">Partner with IYS</h2>
                <p className="lead mb-4 lh-lg">
                  IYS can help your LMS deliver superior value. To get to know
                  the user’s skills profile integrate this “IYS Skills Profiler”
                  plugin to your application.
                </p>
                <p className="lead mb-4 lh-lg">
                  Let users create their “skills profile”. (You save the skills
                  of the users at your end.)
                </p>
                <p className="lead mb-4 lh-lg">
                  Based on the skills of the users make recommendations from
                  your course repository.
                </p>
              </div>
            </div>
            <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-end">
              <img
                src={partnerImg.src}
                alt="Image1"
                className="img-fluid rounded"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )

export default AlterContent;
