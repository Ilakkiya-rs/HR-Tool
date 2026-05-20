'use client';

import bgImg from '../../../assets/images/alterImages/Jobhunt.png';

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
              className="img-fluid"
              alt="..."
            />
          </div>
          <div className="col-12 col-lg-7 col-xl-6">
            <h1 className="mb-4 font-w-4">
              Skills Data for{' '}
              <span className="text-primary fw-regular">Job Portals</span> and{' '}
              <span className="text-primary fw-regular">Recruitment</span>{' '}
              Applications
            </h1>
            <p className="fw-bold lead mb-4 lh-lg">
              Precision and Speed in Skills Matching of Jobs and Job Seekers
            </p>
            <p className="lead mb-4 lh-lg">
              The success of recruitment applications and job portals depend on
              the effective matching of job providers with job seekers. In
              today&apos;s skills-based world, matching based on geography,
              qualifications, years of experience, or titles is not enough. The
              key factor is the alignment of skills between people and jobs.
            </p>
          </div>
        </div>
        {/* <!-- / .row --> */}
      </div>
      {/* <!-- / .container --> */}
    </section>
  );
};

export default Herosection;
