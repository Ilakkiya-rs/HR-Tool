import bgImg from '../../../assets/images/alterImages/01.png';

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
          <h1 className="mb-4 font-w-4 text-primary fw-regular">
            Skills Taxonomy for Training Providers
          </h1>
          <h2 className='mb-4 font-w-4'>Enhance Your Training Offerings with IYS Skills Solutions</h2>
          <div className="mt-5 mb-0">
            <p className="lead lh-lg">
              Are you a training provider, offering a learning platform, or managing a Learning Management System (LMS)?
            </p>
            <p className="lead lh-lg">
              If yes, IYS Skills Taxonomy can help you achieve:
            </p>
            <p className="lead lh-lg">
              <b className="fw-bold border-start border-2 border-primary ps-3">
                Better user engagement
              </b>
              <br />
              <b className="fw-bold border-start border-2 border-primary ps-3">
                Enhanced targeting of your offerings
              </b>
              <br />
              <b className="fw-bold border-start border-2 border-primary ps-3">
                Business growth
              </b>
            </p>
          </div>
        </div>
      </div>
      {/* <!-- / .row --> */}
    </div>
    {/* <!-- / .container --> */}
  </section>
);

export default Herosection;
