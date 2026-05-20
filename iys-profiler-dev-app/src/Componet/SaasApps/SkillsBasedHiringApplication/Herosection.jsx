import bgImg from '../../../assets/images/alterImages/esmSolution.png';

const Herosection = () => (
  <section className="custom-py- position-relative hero-shape overflow-hidden hero-bg text-cente">
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
          <h1 className="mb-5 fw-light">
            IYS Skills Based{' '}
            <span className="text-primary fw-regular">Hiring Application</span>{' '}
          </h1>
          <blockquote className="mt-5 mb-0">
            <p className="lead mb-0">
              Achieve Precision, Speed, and Data-Driven Success in Skills-Based Recruitment
            </p>
            <p className="lead">
              Powered by a Rich Skills Taxonomy
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
