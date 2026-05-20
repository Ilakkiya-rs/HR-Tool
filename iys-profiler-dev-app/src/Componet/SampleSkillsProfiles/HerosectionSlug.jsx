import bgImg from '../../assets/images/alterImages/benefits2.png';

const Herosection = ({ slug }) => (
  <section
    className="position-relative pb-0 overflow-hidden hero-section"
    style={{
      // backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(200, 200, 200, 0.8)), url(${bgImg.src})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '60px 0',
      color: '#333',
    }}
  >
    <div className="container">
      <div className="row align-items-center text-center text-md-start mb-5">
        <div className="col-12 col-md-7">
          <h1 
            className="mb-4 font-w-4" 
            style={{ 
              fontSize: '2.2rem', 
              color: '#333',
              fontWeight: 'bold' 
            }}
          >
            Sample <span className="text-primary fw-regular">{slug}</span> Skills Profile
          </h1>
          <blockquote className="mt-4 mb-0" style={{ fontSize: '1rem', lineHeight: '1.6', color: '#666' }}>
            <p className="lead lh-lg">
              Any individual or job’s skills profile consists of different components including functional / technical skills, soft skills,
              activities, domain expertise and others. And also the proficiency levels in these vary.
            </p>
            <p className="lead lh-lg">
              In this sample {slug} Skills Profile, you can see the different skills and proficiency levels in these skills.
              This is a sample and not an actual. If you are a {slug}, you may visit <a target="_blank" href="https://myskillsplus.com/" style={{ color: '#4285f4', textDecoration: 'underline', }}>
                www.myskillsplus.com
              </a> and create your {slug} Skills Profile.
            </p>
          </blockquote>
        </div>
        <div className="col-12 col-md-5 text-center mt-4 mt-md-0">
          <img src={bgImg.src} alt="Skills Icon" className="img-fluid shadow-lg" style={{ maxWidth: '80%', borderRadius: '15px' }} />
        </div>
      </div>
    </div>
  </section>
);

export default Herosection;
