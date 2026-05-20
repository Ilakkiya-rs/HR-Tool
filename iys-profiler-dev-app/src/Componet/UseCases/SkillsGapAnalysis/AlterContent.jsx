import Link from 'next/link';
import skillsprofile from '../../../assets/images/alterImages/Skills Profile.jpg';
import roleskillsprofile from '../../../assets/images/alterImages/Role Skills Profile.jpg';
import employeeskillsgap from '../../../assets/images/alterImages/Employee Skills Gap.jpg';
import organizationskillsgap from '../../../assets/images/alterImages/Organization Skills Gap.jpg';

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
    title: 'Employee Skills Profiling',
    content: (
      <>
        <p className="lead lh-lg">
          Ensure that all employees&apos; skills and proficiencies are thoroughly mapped. Our application features a built-in skills taxonomy encompassing both Hard and Soft Skills. Employees can assess their skills against their current roles, receive constructive feedback from managers, and gather peer insights. This comprehensive employee skills profiling experience empowers individuals to take charge of their development.
        </p>
      </>
    ),
    imgSrc: skillsprofile.src,
    imgFirst: true
  },
  {
    title: 'Role Skills Profiling',
    content: (
      <>
        <p className="lead lh-lg">
          Profile and map the essential skills required for every role within your organization. These Role Skills Profiles provide precise insights into the competencies necessary for success in each position, serving as vital inputs for effective skills gap assessments and beyond.
        </p>
      </>
    ),
    imgSrc: roleskillsprofile.src,
    imgFirst: false
  },
  {
    title: 'Employee Skill Gap Analysis',
    content: (
      <>
        <p className="lead lh-lg">
          Our Organization Skills Management (OSM) application delivers rich data from both Employee Skills Profiles and Role Skills Profiles. This skill gap analysis allows for a clear understanding of employee strengths and areas for improvement, enabling targeted learning programs that are both relevant and effective.
        </p>
      </>
    ),
    imgSrc: employeeskillsgap.src,
    imgFirst: true
  },
  {
    title: 'Organization Skill Gap Analysis',
    content: (
      <>
        <p className="lead lh-lg">
          Conduct a comprehensive analysis of skills gaps across the entire organization or specific units. Identify high-gap areas and prioritize learning strategies accordingly. This skills gap assessment equips you to direct your training efforts effectively, ensuring your initiatives yield significant results.
        </p>
      </>
    ),
    imgSrc: organizationskillsgap.src,
    imgFirst: false
  }
];

const AlterContent = () => (
  <>
    <section className="py-5 col-lg-12 col-md-9 mx-auto">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-md-6 col-lg-9 mx-auto">
            <div className="mb-5 text-center">
              <p className="mb-3 lead mb-0 lh-lg">
                In today&apos;s competitive landscape, organizations are investing heavily in learning and development to upskill their workforce. However, the effectiveness of these initiatives often comes under scrutiny. The root cause? Ineffective training programs that lack a thorough skill gap analysis.
              </p>
              <p className="mb-3 lead mb-0 lh-lg">
                Conducting a skill gap assessment is crucial for identifying specific areas that need improvement within your organization. This assessment not only informs efficient workforce planning aligned with your objectives but also promotes workforce development, ultimately leading to higher employee retention.
              </p>
              <p className="mb-3 lead mb-0 lh-lg">
                With IYS Organization Skills Management web application, you gain a data-driven, precise, and user-friendly method for skill gap analysis, ensuring your training initiatives yield maximum ROI.
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

    <section>
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div>
            <div className="text-center">
              <h2 className="lh-base">Ready to Elevate Your Learning Initiatives?</h2>
              <div className="row text-center">
                <div className="col-md-6 col-lg-9 mx-auto">
                  <div className="mt-3 lead lh-lg text-center">
                    <p className="text-center">
                      If you&apos;re involved in Learning and Development within your organization, <b className="fw-bold">IYS Skills Solutions</b> can partner with you to conduct effective skill gap assessments and enhance your learning initiatives.
                    </p>
                    <p className="text-center">
                      <b className="fw-bold">Connect with us</b> today to discover how we can help you maximize your workforce&apos;s potential!
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
