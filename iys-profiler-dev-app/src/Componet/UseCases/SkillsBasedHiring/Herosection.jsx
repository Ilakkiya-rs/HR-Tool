'use client';

import bgImg from '../../../assets/images/alterImages/4.png';

const Herosection = () => {
  return (
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
              <span className="text-primary fw-regular">
                Skills-Based Hiring
              </span>
              <br />
              with
              <br />
              IYS Skills Solutions
            </h1>
            <blockquote className="mt-5 mb-0 ps-3 border-start border-primary">
              <div className="mb-5">
                <p className="lead mb-0 lh-lg">
                  Dramatically Improve Skills Mapping, Analysis, and Matching using the skill based recruitment solutions of IYS Skills Tech.
                </p>
              </div>
            </blockquote>
          </div>
        </div>
        {/* <!-- / .row --> */}
      </div>
      {/* <!-- / .container --> */}
    </section>
  );
};

export default Herosection;
