// import esmSolution from '../../assets/images/alterImages/esmSolution.png';
import Link from 'next/link';
import location from '../../../assets/images/alterImages/location.png';
import organizeresume from '../../../assets/images/alterImages/organizeresume.png';
import skillsmapping from '../../../assets/images/alterImages/skillsmapping.png';

const Section = ({ title, content, imgSrc, imgFirst, link, linkText }) => (
  <section className="py-5 my-5">
    <div className="container">
      <div
        className={`d-flex ${
          imgFirst
            ? 'flex-column-reverse flex-lg-row-reverse'
            : 'flex-column-reverse'
        } flex-lg-row align-items-center justify-content-between`}
      >
        <div className="col-12 col-lg-5 px-3">
          <div className="mb-">
            <h2 className="lh-base">{title}</h2>
            {content}
            {link && linkText && (
              <Link
                href={link}
                className="lead"
                style={{
                  textDecoration: 'underline',
                  textUnderlineOffset: '5px'
                }}
              >
                {linkText}
              </Link>
            )}
          </div>
        </div>
        <div
          className={`
          ${
            imgFirst
              ? 'justify-content-start'
              : 'mt-3 mt-lg-0 justify-content-end'
          }
          col-12 col-lg-7 d-flex align-items-center`}
        >
          <img src={imgSrc} alt={title} className="img-fluid rounded" />
        </div>
      </div>
    </div>
  </section>
);

const sections1 = [
  {
    title: 'Best Skills Mapping for Individuals',
    content: (
      <>
        <p className="lead lh-lg">
          Individuals can now create their skills profile, mapping their skills
          and proficiencies comprehensively and precisely, regardless of
          industry or function. This is facilitated by the rich and regularly
          updated IYS Skills Taxonomy.
        </p>
      </>
    ),
    imgSrc: skillsmapping.src,
    imgFirst: true,
    link: '/experience-iys-skills-profiler',
    linkText: 'Experience Skills Mapping'
  },
  {
    title: 'Best Skills Mapping for Jobs',
    content: (
      <>
        <p className="lead lh-lg">
          Articulating required skills and proficiencies is now made easy. The
          intuitive Skills Profiler helps Hiring Managers specify relevant
          skills for the job, moving beyond generic requirements like years of
          experience.
        </p>
      </>
    ),
    imgSrc: organizeresume.src,
    imgFirst: false,
    link: '/experience-iys-skills-profiler',
    linkText: 'Experience Skills Mapping'
  }
];

const AlterContent = () => (
  <>
    <section className="py-5 my-5">
      <div className="container">
        <div className="text-center">
          <div className="col-8 mx-auto">
            <div className="mb-5">
              <h2 className="lh-base">
                Enrich skills matching with IYS Skills Taxonomy and Skills
                Profiler
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>

    {sections1.map((section, index) => (
      <Section
        key={index}
        title={section.title}
        content={section.content}
        imgSrc={section.imgSrc}
        imgFirst={section.imgFirst}
        link={section.link}
        linkText={section.linkText}
      />
    ))}

    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-12">
            <div className="mb-5 text-cente">
              <h3 className="lh-base">
                Recruitment applications, job portals, and professional networks
                can seamlessly integrate the Skills Taxonomy or Skills Profiler
                into their platforms.
              </h3>
              <br />
              <div className="row border">
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <p className="text-center">
                      Google map integrated in car hailing company (like Uber /
                      Ola)
                    </p>
                    <img
                      src={location.src}
                      alt="google map"
                      className="img-fluid rounded"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <p className="text-center">
                      IYS Skills Profiler is integrated with job portals /
                      recruitment portals.
                    </p>
                    <img
                      src={organizeresume.src}
                      alt="iys integration"
                      className="img-fluid rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-12">
            <div className="mb-5 text-cente">
              <h2 className="lh-base">Richness of IYS Skills Taxonomy</h2>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">Curated using AI</b>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">Governed by Human Intelligence</b>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">300K unique skills terms</b>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">Proxy terms</b>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">Synonyms</b>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">3K Skills categories</b>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">1.5 million association of terms</b>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">Constantly update</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-12">
            <div className="mb-5 text-cente">
              <h2 className="lh-base">
                Benefits of Integrating IYS Skills Taxonomy or Skills Profiler
              </h2>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">Enhanced User Engagement</b>
                    <p>
                      Job seekers can create a detailed Skills Profile on your
                      platform, allowing them to take stock of their skills and
                      engage more deeply with your application.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">
                      Rich Data for Precise Recommendations
                    </b>
                    <p>
                      Your platform will be enriched with comprehensive skills
                      data, enabling precise job recommendations that go beyond
                      basic experience and qualifications.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">
                      Improved Engagement with Job Providers
                    </b>
                    <p>
                      Hiring Managers and Recruiters can create detailed Skills
                      Profiles for the jobs they seek to fill, articulating
                      skills needs accurately.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">Superior Skills Matching</b>
                    <p>
                      With rich skills data of individuals and jobs, your
                      platform can provide highly relevant job matches,
                      eliminating inappropriate recommendations.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">Updated Skill Profiles</b>
                    <p>
                      With users able to create and update their Skills
                      Profiles, you will have the most recent and accurate
                      skills data, rather than relying on outdated resumes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default AlterContent;
