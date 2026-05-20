// import esmSolution from '../../assets/images/alterImages/esmSolution.png';
import Link from 'next/link';
import completeSolution from '../../assets/images/alterImages/completeSolution.png';
import grades from '../../assets/images/alterImages/grades.png';
import profilerPlugin from '../../assets/images/alterImages/profillerPlugin.png';

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
    title: 'IYS Skills Taxonomy',
    content: (
      <>
        <b className="fw-bold lead lh-lg">
          The IYS Skills Taxonomy is an extensive dataset covering functions, industries, behaviors, and other workplace attributes. It serves as the foundation for skills-based and competency-based people management.
        </b>
        <hr />
        <div className="lead lh-lg">
          <b className="fw-bold">Key Features of the IYS Skills Taxonomy:</b>
          <ul>
            <li>One of the most comprehensive libraries of its kind</li>
            <li>Regular updates to keep pace with the evolving workplace</li>
            <li>Embedded AI for advanced skill profiling and competency profiling</li>
          </ul>
        </div>
        <p className="lead lh-lg">
          This taxonomy streamlines your journey toward effective skills-based management.
        </p>
      </>
    ),
    imgSrc: completeSolution.src,
    imgFirst: true,
    link: '/experience-iys-skills-profiler',
    linkText: 'Experience the IYS Skills Taxonomy here'
  },
  {
    title: 'IYS Skills Profiler',
    content: (
      <>
        <b className="fw-bold lead lh-lg">
          The IYS Skills Profiler extracts and evaluates skills from both job roles and employees, determining proficiency levels and ensuring a better match between job requirements and individual capabilities.
        </b>
        <hr />
        <div className="lead lh-lg">
          <b className="fw-bold">
            Key Aspects of the IYS Skills Profile:
          </b>
          <ul>
            <li>Skills required for a job, including proficiency levels</li>
            <li>Skills offered by an individual, with detailed proficiency assessments</li>
          </ul>
        </div>
        <p className="lead lh-lg fw-bold">How does skills profiling help?</p>
        <p className="lead lh-lg">
          Skill profiling and competency profiling enable organizations to analyze skills data for recruitment, workforce planning, and career development, ensuring optimal alignment between roles, individuals and organizational needs.
        </p>
        <p className="lead lh-lg">
          Skill profiling facilitates the identification of skills gaps within the workforce that can be bridged through targeted development programmes, and training.
        </p>
      </>
    ),
    imgSrc: grades.src,
    imgFirst: false,
    link: '/skills-taxonomy-and-profiler',
    linkText: 'Experience Skill profiling here'
  },
  {
    title: 'IYS Skills Management',
    content: (
      <>
        <p className="lead lh-lg">
          IYS Skills Management is a powerful SaaS application designed for managing skills in organizations. It covers skills inventory, skills gap analysis, skills planning, and skills deployment.
        </p>
        <br />
        <p className="lead lh-lg">
          This tool, bundled with the Skills Taxonomy and Skills Profiler, offers a strong ROI for organizations investing in skills-based practices.
        </p>
      </>
    ),
    imgSrc: profilerPlugin.src,
    imgFirst: true,
    link: '/saas-application/organization-skills-management-osm',
    linkText: 'Know Learn more about IYS Skills Management here'
  }
];

const AlterContentTwo = () => (
  <>
    <section className="py-5 my-5">
      <div className="container">
        <div className="text-center">
          <div className="col-8 mx-auto">
            <div className="mb-5">
              <h2 className="lh-base">
                Skill-Based Enrichment of HR Functions
              </h2>
              <p className="lead mb-4 lh-lg">
                <b className='fw-bold'>By leveraging skill profiling and competency profiling in HR functions, organizations can:</b>
                <br />
                Eliminate inconsistency and bias in hiring
                <br />
                Open doors for lateral mobility
                <br />
                Align employee more closely with suitable roles
                <br />
                Enable transparent ROI calculation for L&D
                <br />
                <Link
                  href="#useCases"
                  style={{
                    textDecoration: 'underline',
                    textUnderlineOffset: '5px'
                  }}
                >
                  Read Use Cases
                </Link>
              </p>
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
              <h2 className="lh-base">Highlights of Our Solution</h2>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">1. Industry Agnostic:</b>
                    <br />
                    <p className="ms-md-3">
                      Adapts seamlessly to any industry, ensuring effective skills management across sectors.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">2. Flexible Deployment Options:</b>
                    <br />
                    <p className="ms-md-3">
                      Choose from a variety of flexible deployment options, including Database, API, Plugin, or full-fledged application, tailored to your organization&apos;s needs.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">
                      3. Integrations & Technical Support:
                    </b>
                    <br />
                    <p className="ms-md-3">
                      Seamless integration with existing HR Tech and dedicated technical support.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3 mt-3 lead mb-0 lh-lg">
                    <b className="fw-bold">4. Budget-Friendly:</b>
                    <br />
                    <p className="ms-md-3">
                      Flexible pricing to meet the unique needs of your organization.
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

export default AlterContentTwo;
