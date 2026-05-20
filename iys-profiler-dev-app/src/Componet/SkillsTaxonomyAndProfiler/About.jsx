import profilerImg from '../../assets/images/alterImages/profiler.png';
// import taxonomy from '../../assets/images/alterImages/taxonomy.png';

const AboutL1 = () => {
  return (
    <>
      {/* one */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
            {/* <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-start">
              <img
                src={taxonomy.src}
                alt="taxonomy"
                className="img-fluid rounded"
              />
            </div> */}
            <div className="col-12 col-lg-12">
              <div className="mb-5 text-center">
                <h2 className="lh-base">IYS Skills Taxonomy</h2>
                <p className="mb-3 lead mb-0 lh-lg">
                  <b className="fw-bold">Is a large dataset of skills</b>
                  <br />
                  (with millions of records)
                </p>
                <p className="mb-3 lead mb-0 lh-lg">
                  <b className="fw-bold">Covering all aspects of “skills” </b>
                  <br />
                  (technical / functional skills, soft skills, activities in
                  roles, domain expertise, certifications)
                </p>
                <p className="mb-3 lead mb-0 lh-lg">
                  <b className="fw-bold">
                    Curated, organized smartly and constantly updated
                  </b>
                  <br />
                  (using AI and DI - Domain Intelligence)
                </p>
                <p className="mb-3 lead mb-0 lh-lg">
                  <b className="fw-bold">
                    Covering all functions and disciplines
                  </b>
                  <br />
                  (such as engineering, HR, Supply Chain, Accounts / Finance,
                  Management, Sciences)
                </p>
                <p className="mb-3 lead mb-0 lh-lg">
                  <b className="fw-bold">Covering a range of industries</b>
                  <br />
                  (such as IT, BFSI, Manufacturing, Engineering, Logistics,
                  Retail, Healthcare)
                </p>
                <p className="mb-3 lead mb-0 lh-lg">
                  <b className="fw-bold">With mapping of skills to roles</b>
                  <br />
                  (such as Developer, Analyst, Chemist, Nurse, Salesperson)
                </p>
                <p className="mb-3 lead mb-0 lh-lg">
                  <b className="fw-bold">
                    With goal of making talent space skills-data-centric
                  </b>
                  <br />
                  (such as learning & development, hiring, workforce planning,
                  compensation)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 my-5">
        <div className="container">
          <div className="d-flex flex-column-reverse flex-lg-row align-items-center justify-content-between">
            <div className="col-12 col-lg-5 text-cente">
              <div className="mb-5">
                <h2 className="lh-base">IYS Skills Profiler</h2>
                <p className="lead mb-0 lh-lg">
                  Is a frontend that helps people in mapping skills
                </p>
                <p className="lead mb-0 lh-lg fw-bold">
                  Simple ⦿ Intiuitive ⦿ Comprehensive
                </p>
                <p className="lead mb-0 lh-lg">
                  <b>That enables skills Profiling of Individuals</b>
                  <br />
                  (employees, applicants, students) Jobs
                </p>
              </div>
            </div>
            <div className="col-12 col-lg-7 mb-5 mb-lg-0 d-flex align-items-center justify-content-end">
              <img
                src={profilerImg.src}
                alt="profiler"
                className="img-fluid rounded"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutL1;
