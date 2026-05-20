import Link from 'next/link';
import applicant from '../../../assets/images/alterImages/partner.png';
import datadriven from '../../../assets/images/alterImages/grades.png';
import mapping from '../../../assets/images/alterImages/challengesSKILLS.png';
import recruitment from '../../../assets/images/alterImages/esmSolution.png';

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
    title: 'Mapping Job Skills',
    text: [
      'Job descriptions are crucial for any hiring process. A traditional approach often fails to articulate the required skills effectively. IYS’s Skills Taxonomy and Skills Profiler help hiring managers specify the necessary skills for their positions accurately. Such an efficient job description will enable them to initiate the process of skill based hiring successfully! Clear data regarding job skills can also benefit applicants significantly. It will help them to decipher the different skills that are required for executing the responsibilities of the concerned job successfully. This in turn will help in eliminating a lot of irrelevant applications while conducting skill based recruitment.'
    ],
    imgSrc: mapping.src,
    imgFirst: true
  },
  {
    title: 'Mapping Applicant Skills',
    text: [
      'Traditional hiring process relies completely on resumes which indicate educational qualifications, total work experience, and related information. However, depending on this hiring approach will not facilitate the recruitment of competent candidates. Hence, organizations must bid goodbye to irrelevant or outdated resumes, and embrace the skill based hiring approach. With IYS, applicants indicate their skills and proficiency levels, making it easy to assess their suitability for the job. This enhances skill based recruitment by ensuring that the right candidates are matched to the right roles.'
    ],
    imgSrc: applicant.src,
    imgFirst: false
  },
  {
    title: 'Data-Driven Comparison of Applicant Skills',
    text: [
      'With structured data on applicant and job skills, hiring managers can conduct efficient skill based hiring. They will be able to analyze skill matches, identify gaps, compare candidates, and make informed decisions. Thus, they will not have to spend hours going through the accumulated resumes. Instead, they can quickly, and efficiently analyze the applicant skills, and identify the candidates that are perfect for the concerned job. Skill based recruitment process using efficient data on job and applicant skills will help recruiting authorities to make the best decisions for the successful growth and well-being of their organization.',
      'Explore how our tools can transform your recruitment strategy by making skill based hiring techniques a core part of your approach.'
    ],
    imgSrc: datadriven.src,
    imgFirst: true,
    link: '/experience-iys-skills-profiler',
    linkText: 'Experience skills mapping'
  }
];

const sections2 = [
  {
    title: (
      <div>
        Recruitment Software Applications Users
        <br /> <span className="fw-base text-primary">And</span> <br />{' '}
        Recruitment Software Application Developers
      </div>
    ),
    text: [
      'Users (Recruiters) and Developers of Recruitment Software Applications can benefit from IYS Skills Taxonomy and Profiler. They can be integrated with Resume/ Application/ ATS to enhance the quality of skills data, leading to more effective and precise skill based recruitment.',
      'The team at IYS Skills Tech are highly efficient, and they can offer organizations all the necessary tools, and resources to adopt the approach of skill based recruitment. This will allow firms to acquire the best workforce that will contribute to the growth of their organization. Such an approach will also enable organizations to thrive successfully in this highly competitive, and dynamic business landscape.'
    ],
    imgSrc: recruitment.src,
    imgFirst: true,
    link: '/skills-taxonomy-and-profiler',
    linkText: 'Know More about the Skills Taxonomy'
  }
];

const AlterContent = () => (
  <>
    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-12">
            <div className="mb-5 text-center">
              <h2 className="lh-base">
                Key Requirements for Skills-Based Hiring
              </h2>
              <p className="mb-3 lead mb-0 lh-lg">
                Accurate Mapping of Job Skills
              </p>
              <p className="mb-3 lead mb-0 lh-lg">
                Accurate Mapping of Applicant Skills
              </p>
              <p className="mb-3 lead mb-0 lh-lg">
                In-depth Analysis of Skills
              </p>
              <p className="mb-3 lead mb-0 lh-lg">
                Decision Support for Best Fit
              </p>
              <p className="mb-3 lead mb-0 lh-lg">
                <b className="fw-bold">Fulfilled with IYS Skills Solutions for skill based hiring.</b>
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
                Benefits of Skills-Based Hiring with IYS
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
    <section className="py-5 my-5">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-12">
            <div className="mb-5 text-center">
              <h2 className="lh-base">
                Solutions for Different Recruitment Players
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
    {sections2.map((section, index) => (
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
