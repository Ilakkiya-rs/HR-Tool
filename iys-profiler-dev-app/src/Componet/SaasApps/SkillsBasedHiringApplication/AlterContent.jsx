import Link from 'next/link';
import mapping from '../../../assets/images/alterImages/challengesSKILLS.png';
import datadriven from '../../../assets/images/alterImages/grades.png';
import applicant from '../../../assets/images/alterImages/partner.png';

const Section = ({ title, text, imgSrc, imgFirst, link, linkText }) => (
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
            {text.map((paragraph, index) => (
              <p key={index} className="lead lh-lg">
                {paragraph}
              </p>
            ))}
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
    title: 'Precise Job Skills Mapping',
    text: [
      'Effectively map all required skills for a job, including methods, tools, technologies, and processes. Our rich Skills Taxonomy helps you articulate both technical and soft skills needed, along with their required proficiencies. This results in a comprehensive and structured Job Skills Profile, a vital starting point for effective skills-based hiring.'
    ],
    imgSrc: mapping.src,
    imgFirst: true
  },
  {
    title: 'Structured Skills Inputs from Candidates',
    text: [
      'Candidates receive the Job Skills Profile and indicate their skills, proficiencies, and relevant comments. This preliminary self-screening ensures candidates understand the job requirements and prevents outdated or irrelevant resumes from cluttering the recruitment process. The structured data-driven skills inputs from candidates enable a clearer assessment of job fit.'
    ],
    imgSrc: applicant.src,
    imgFirst: false
  },
  {
    title: 'Rich Skills Data-Driven Decision Support',
    text: [
      'Hiring managers can immediately compare a candidate’s skills and proficiencies against the job requirements upon submission. This eliminates the need to manually process resumes, allowing managers to quickly compare candidates, make trade-offs, and determine the best fit. Structured skills mapping accelerates and enhances decision-making, reducing time spent on tedious resume reviews.'
    ],
    imgSrc: datadriven.src,
    imgFirst: true,
    link: '/experience-iys-skills-profiler',
    linkText: 'Experience skills mapping'
  }
];

const AlterContent = () => (
  <>
    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-12">
            <div className="mb-5 text-center">
              <h2 className="lh-base">IYS offers a powerful yet simple application for skills-based hiring that enables:</h2>
              <p className="mb-3 lead mb-0 lh-lg">
                Comprehensive skills mapping of jobs
              </p>
              <p className="mb-3 lead mb-0 lh-lg">
                Accurate skills mapping of candidates
              </p>
              <p className="mb-3 lead mb-0 lh-lg">
                Data-driven selection decisions
              </p>
              <p className="mb-3 lead mb-0 lh-lg">This is made possible by:</p>
              <p className="mb-3 lead mb-0 lh-lg">
                <b className="fw-bold">IYS Skills Taxonomy | Skills Profiler</b>
              </p>
              <p className="mb-3 lead mb-0 lh-lg">
                An exhaustive, smart, and regularly updated database of skills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-12">
            <div className="mb-5 text-center">
              <h2 className="lh-base">
                Key features of IYS Skills Based Hiring Application
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
        text={section.text}
        imgSrc={section.imgSrc}
        imgFirst={section.imgFirst}
        link={section.link}
        linkText={section.linkText}
      />
    ))}
  </>
);

export default AlterContent;
