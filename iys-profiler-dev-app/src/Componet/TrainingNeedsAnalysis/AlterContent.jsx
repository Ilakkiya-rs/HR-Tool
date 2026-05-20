import Link from 'next/link';
import organizationskillsgap from '../../assets/images/alterImages/Organization Skill.png';
import hardskills from '../../assets/images/alterImages/Hard Skills.png';
import employeeskillsgap from '../../assets/images/alterImages/Employee Skills Gap.png';

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
    title: 'The Importance of Training Needs Analysis and Assessment',
    content: (
      <>
        <p className="lead lh-lg">
          Conducting a comprehensive <b className="fw-bold">Training Needs Analysis</b> is essential for identifying the specific skills and competencies required for success within your organization. This analysis allows HR professionals to pinpoint areas where employees may need additional training and development. Similarly, a thorough <b className="fw-bold">Training Needs Assessment</b> evaluates the current skills of employees against the required competencies, ensuring that your training programs are targeted and effective.
        </p>
        <p className="lead lh-lg">
          According to a report by the Association for Talent Development (ATD), organizations that implement effective training needs assessments can increase employee engagement and retention by up to 60%. By utilizing IYS Skills Tech&apos;s solutions, you can leverage our integrated Skills Taxonomy to streamline your training needs analysis process.
        </p>
      </>
    ),
    imgSrc: organizationskillsgap.src,
    imgFirst: true
  },
  {
    title: 'Integrated Skills Taxonomy: Your Competitive Advantage',
    content: (
      <>
        <p className="lead lh-lg">
          One of the standout features of our application is the integrated <b className="fw-bold">Skills Taxonomy</b> or competency library. This exhaustive and comprehensive skills database covers a wide range of industries and functions, encompassing both Hard and Soft Skills.
        </p>
        <hr />
        <div className="lead lh-lg">
          <b className="fw-bold">Benefits of the Integrated Skills Taxonomy</b>
          <div className="lead lh-lg">
            <ol>
              <li><b className="fw-bold">Efficiency:</b> Since our Skills Taxonomy is integrated within the OSM application, organizations can avoid the costs and time associated with hiring consultants to create a skills database.</li>
              <li><b className="fw-bold">Accessibility:</b> The Skills Profiler, which serves as the frontend of our Skills Taxonomy, allows HR professionals to easily map skills and proficiencies, creating accurate skills profiles for employees. This capability simplifies the <b className="fw-bold">Training Needs Assessment</b> process by providing immediate insights into the competencies required for various roles.</li>
              <li><b className="fw-bold">Continuous Updates:</b> The Skills Taxonomy is continually updated to reflect market trends and changing job requirements, ensuring that your organization remains agile and competitive.</li>
            </ol>
          </div>
        </div>
        <p className="lead lh-lg">
          By harnessing the power of the Skills Taxonomy, you can conduct thorough <b className="fw-bold">Training Needs Analyses</b> that lead to informed decision-making and effective training initiatives.
        </p>
      </>
    ),
    imgSrc: hardskills.src,
    imgFirst: false
  },
  {
    title: 'Streamlining the Training Needs Assessment Process',
    content: (
      <>
        <p className="lead lh-lg">
          With IYS Skills Tech&apos;s OSM application, the <b className="fw-bold">Training Needs Assessment</b> process is more straightforward than ever. Here&apos;s how our solution enhances your training strategy.
        </p>
        <div className="lead lh-lg">
          <ul>
            <li><b className="fw-bold">Individual Assessments:</b> Employees can utilize the Skills Profiler to evaluate their skills against organizational expectations, identifying areas for development.</li>
            <li><b className="fw-bold">Group Analysis:</b> Conduct assessments at the organizational unit level to understand collective skill gaps, allowing for targeted training programs that benefit the entire team.</li>
            <li><b className="fw-bold">Strategic Learning Plans:</b> Use the insights gained from skills assessments to develop personalized development plans, ensuring that employees receive the training they need to excel in their roles.</li>
          </ul>
        </div>
      </>
    ),
    imgSrc: employeeskillsgap.src,
    imgFirst: true
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
                In today&apos;s competitive landscape, effective Training Needs Analysis and Training Needs Assessment are crucial for organizations aiming to develop their employees and achieve strategic objectives. At IYS Skills Tech, we understand the importance of aligning your training initiatives with organizational goals. Our Organization Skills Management (OSM) application empowers HR professionals to identify and address skill gaps efficiently, ensuring that your workforce is well-prepared for the challenges ahead.
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
            <h2 className="lh-base text-center">Experience the IYS Advantage</h2>
            <div className="row">
              <div className="col-md-6 col-lg-9 mx-auto">
                <div className="mt-3 lead lh-lg text-center">
                  <p className="text-center">
                    Are you ready to transform your organization&apos;s learning strategy? With <b className="fw-bold">IYS Skills Tech,</b> conducting effective <b className="fw-bold">Training Needs Analysis</b> and <b className="fw-bold">Training Needs Assessment</b> has never been easier.
                  </p>
                </div>
                <div className="lead lh-lg">
                  <ul>
                    <li><b className="fw-bold"><a style={{textDecoration: 'underline',textUnderlineOffset: '5px'}} href="/">Experience the Skills Taxonomy:</a></b> Explore our comprehensive skills database to see how it can benefit your organization.</li>
                    <li><b className="fw-bold"><a style={{textDecoration: 'underline',textUnderlineOffset: '5px'}} href="/sample-skills-profiles">View Sample Skills Profiles:</a></b> View sample skills profiles to understand the competencies required for various roles.</li>
                    <li><b className="fw-bold"><a style={{textDecoration: 'underline',textUnderlineOffset: '5px'}} href="/saas-application/organization-skills-management-osm">Learn More About Our OSM Application:</a></b> Discover the Organization Skills Management application and request a demo today!</li>
                  </ul>
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
