import bgImg from '../../assets/images/alterImages/benefits2.png';

const Herosection = () => (
  <section className="custom-py- position-relative hero-shape overflow-hidden hero-bg">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-12 col-lg-5 col-xl-6 order-lg-2 mb-8 mb-lg-0">
          {/* <!-- Image --> */}
          <img
            style={{ width: '631px', height: 'auto' }}
            src={bgImg.src}
            className="img-fluid lighten-image"
            alt="..."
          />
        </div>
        <div className="col-12 col-lg-7 col-xl-6">
          <h1 className="mb-4 font-w-4">
          Sample{' '}
            <span className="text-primary fw-regular">Skills Profiles</span>
          </h1>
          <blockquote className="mt-5 mb-0 ps-3 border-start border-primary">
            <p className="lead mb-4 lh-lg">
              Skills Profiles are an easy to understand, comprehensive and
              structured representation on “skills” and proficiencies in the
              skills. “Skills” include Knowledge, Technical / Functional skills,
              Activities, Tools, Domain experience and others.
            </p>
          </blockquote>
        </div>
      </div>
      {/* <!-- / .row --> */}
    </div>
    {/* <!-- / .container --> */}
  </section>
);

export default Herosection;
