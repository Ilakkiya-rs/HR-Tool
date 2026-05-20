import hiring from '../../assets/images/alterImages/hiring.png';
import lmsSolutionImg from '../../assets/images/alterImages/lmsSolution.png';
import skillsProfilerImg from '../../assets/images/alterImages/grades.png';

const AlterContent = () => (
  <>
    {/* one */}
    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-start">
            <img
              src={hiring.src}
              alt="Image1"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-12 col-lg-5">
            <div className="mb-5">
              <h2 className="lh-base">
                Skills Taxonomy / Profiler for Recruitment
              </h2>
              <p className="lead mb-4 lh-lg">
                Matching skills of candidates to that of jobs is a key driver of
                efficiency and quality in recruitment. IYS Skills Taxonomy helps
                in mapping of the skills of jobs and that of candidates in a
                holistic manner with skills wise proficiency levels. The Skills
                Taxonomy thus can be put to good use by Recruimtne Systems, ATS
                (Applicant Tracking Systems) and Job Portals
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
              <h2 className="lh-base">
                Skills Taxonomy / Profiler for Learning and Development
              </h2>
              <p className="lead mb-4 lh-lg">
                Understanding of one’s skills and gaps in skills help in
                directing the individual to the right learning and development
                courses. IYS Skills Taxonomy and Profiler helps in mapping of
                individuals’ skills and helps in skills gap analysis for better
                alignment of learning programs and the individuals. The Skills
                Taxonomy and Profiler can be useful for Learning Management
                Systems (LMS), Training Course Providers and Trainers
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
              <h2 className="lh-base">
                Skills Taxonomy / Profiler for Workforce Planning
              </h2>
              <p className="lead mb-4 lh-lg">
                Who to place in which position? Who can be moved from one
                project to another? Can recruitment requirement be fulfilled
                from within the system? Such questions are best answered with a
                good skills mapping of employees and jobs - an area that IYS
                Skills Taxonomy and Profiler can immensely help. Thus Workforce
                Planning Systems, Resource Planning Systems and Project
                Management systems will find IYS SKills Taxonomy and Profiler
                very useful.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default AlterContent;
