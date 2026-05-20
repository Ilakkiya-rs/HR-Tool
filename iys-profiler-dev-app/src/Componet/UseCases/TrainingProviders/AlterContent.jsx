import Link from 'next/link';
import boostFinance from '../../../assets/images/alterImages/database.png';
import moviesImg from '../../../assets/images/alterImages/movies.png';
import personsSkills from '../../../assets/images/alterImages/personsSkills.png';
import trainingOfferings from '../../../assets/images/alterImages/trainingOfferings.png';

const Section = ({ title, text, imgSrc, imgFirst, link, linkText, isList }) => (
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
            {isList ? (
              <ul className="lead lh-lg">
                {text.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              text.map((paragraph, index) => (
                <p key={index} className="lead lh-lg">
                  {paragraph}
                </p>
              ))
            )}
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
    title: 'Focus on Individual Learning Needs',
    text: [
      "Every individual's learning requirements are unique, influenced by their current skills profile, skills gaps with their job within their role, or career aspirations. Understanding these specific needs allows you to offer tailored learning programs, moving beyond generic training catalogs to personalized, impactful learning experiences."
    ],
    imgSrc: trainingOfferings.src,
    imgFirst: true
  },
  {
    title: 'Skills Mapping to Understand Individual Needs',
    text: [
      'IYS helps engage users by mapping their skills through our powerful Skills Taxonomy and Skills Profiler tools. Integrate these tools into your application to enable users to map their skills easily, improving engagement and satisfaction.'
    ],
    imgSrc: personsSkills.src,
    imgFirst: false,
    link: '/experience-iys-skills-profiler',
    linkText: 'Experience Skills Profiling'
  },
  {
    title: 'Tailored Training Recommendations',
    text: [
      'With detailed individual skills profiles, you can recommend the most relevant training programs from your course list. Personalized recommendations enhance user satisfaction and can be continually improved using AI/ ML technologies.'
    ],
    imgSrc: moviesImg.src,
    imgFirst: true
  },
  {
    title: 'About Skills Taxonomy and Skills Profiler',
    text: [
      'A large smartly structured database of skills',
      'Covers “Hard” and “Soft” skills',
      'Covers all functions and range of industries',
      'Curated and Organized using AI and Human Intelligence',
      'Constantly updated',
      "Smartly recommends skills based on one's current skill set",
      'Helps map skills in detail',
      'A four-point proficiency scale for skill levels',
      'Easy to use'
    ],
    imgSrc: boostFinance.src,
    imgFirst: false,
    link: '/experience-iys-skills-profiler',
    linkText: 'Experience Skills Profiling',
    isList: true
  }
];

const AlterContent = () => (
  <>
    {sections1.map((section, index) => (
      <Section
        key={index}
        title={section.title}
        text={section.text}
        imgSrc={section.imgSrc}
        imgFirst={section.imgFirst}
        link={section.link}
        linkText={section.linkText}
        isList={section.isList}
      />
    ))}
  </>
);

export default AlterContent;
