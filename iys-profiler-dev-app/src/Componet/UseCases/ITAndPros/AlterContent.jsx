import Link from 'next/link';
import mapping from '../../../assets/images/alterImages/challengesSKILLS.png';
import deployment from '../../../assets/images/alterImages/methodology.png';
import profillerPlugin from '../../../assets/images/alterImages/profillerPlugin.png';

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
    title: 'Precise Skills Mapping',
    text: [
      'IYS helps you map the Skills Profile of your resources. There is a lot more to a skills profile than simply a few words on skills here and there like Java or Financial Analysis. The Skills Taxonomy helps one get into details of one’s Hard Skills (like knowledge of concepts, methods, standards, tools, technologies) and Soft Skills (Aptitude, People skills). Skills Profiling of your resources will give you a complete inventory of the skills in your organization. IYS tracks the evolving workplace and updates the skills taxonomy on a regular basis so that mapping is always current and precise.'
    ],
    imgSrc: mapping.src,
    imgFirst: true
  },
  {
    title: 'Improve Deployment and Discoverability of skills within',
    text: [
      'Often Professional Services companies end up hiring when resources within the company could have been suitable for an opening or requirement. Problem - “Discoverability”. From the other side, resources tend to get idle when their area of work is experiencing a lean period, while another function in the company could be overloaded. Skills Profiling and Skills inventory will help in the visibility of the skills across the organization so that before one takes a decision to hire one can explore opportunities to fulfill the demand from within. It also leads to a better utilization of resources.'
    ],
    imgSrc: deployment.src,
    imgFirst: false
  },
  {
    title: 'Improve Response to Opportunities - current and future',
    text: [
      'Frontline Managers interacting with customers will immensely benefit from the visibility of the available skills within the organization. It will equip them to respond to opportunities for resource deployment or projects ‘here and now’ without going through multiple layers of the organization to discover the availability of suitable resources. Pooling of opportunities will help take strategic decisions on emerging patterns on skills in demand. This information, readily available, will facilitate decisions on hiring and training, down to the level of an individual resource.'
    ],
    imgSrc: profillerPlugin.src,
    imgFirst: true
  }
];

const AlterContent = () => (
  <>
    <section className="py-5 my-5 col-lg-6 mx-auto">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="col-12 col-lg-12">
            <div className="mb-5 text-center">
              <h2 className="lh-base">
                Comprehensive Skills Management Solutions
              </h2>
              <p className="mb-3 lead lh-lg">
                Skills are at the heart of IT and professional services companies. Ensuring readiness with the skills demanded by customers, keeping costs under control, effectively utilizing skills, and preparing the workforce for future needs are critical.
              </p>
              <p className="mb-3 lead lh-lg">
                IYS offers skills solutions for IT and Professional Services companies to fulfill these goals.
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
              <h2 className="lh-base">Benefits of IYS Skills Solutions</h2>
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
