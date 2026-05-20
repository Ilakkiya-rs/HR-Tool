import itSkillsImg from '../../assets/images/alterImages/ITSkills.png';
import skillsPluginImg from '../../assets/images/alterImages/skillsPlugin.png';
import methodologyImg from '../../assets/images/alterImages/methodology.png';

const AlterContent = () => (
  <>
    {/* one */}
    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-start">
            <img
              src={itSkillsImg.src}
              alt="Image1"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-12 col-lg-5">
            <div className="mb-5">
              <h2 className="lh-base">IT Skills</h2>
              <p className="lead mb-0 lh-lg">
                Information Technology is one of the most dynamic fields with
                fast change in technology, occupations and skills thereof. The
                complexity emerges from combination of concepts, tools,
                activities and domain all of which keep evolving.
              </p>
              <p className="lead mb-0 lh-lg">
                At the same time for anyone in the talent related function in IT
                such as recruitment, training, career development, HR analytics,
                HR strategy and others need quality data on skills to manage
                people and business processes.
              </p>
              <p className="lead mb-0 lh-lg">
                The well organized, and constantly updated IYS Skills Taxonomy
                provides rich IT skills coverage so that these functions can be
                run in a highly efficient manner based on data on skills of
                people and jobs.
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
              <h2>About IYS</h2>
              <p className="lead mb-0 lh-lg">
                IYS specializes in and focuses on skills research, and
                maintaining a rich skills taxonomy. Skills is a complex data set
                with lot of variables. With research over the years, IYS has
                matured its data structure to cater to these variables in the
                skills space.
              </p>
              <p className="lead mb-0 lh-lg">
                IYS provides the Skills Taxonomy for the benefit of other skills
                based applications like HRIS, LMS, Recruitment Systems, ATS
                (Applicant Tracking Systems), Job Portals, Talent Management
                systems and others.
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-end">
            <img
              src={skillsPluginImg.src}
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
              src={methodologyImg.src}
              alt="Image1"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-12 col-lg-5">
            <div className="mb-5">
              <h2 className="lh-base">Methodology</h2>
              <p className="lead mb-0 lh-lg">
                IYS blends AI with Human Intelligence (HI) in the skills domain.
                Using technology tools IYS curates skills from different sources
                and screens the curated skills. The setting of rules for
                organization, vetting of inclusion of terms and governance of
                skills data is done manually with support from SMEs (Subject
                Matter Experts).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default AlterContent;
