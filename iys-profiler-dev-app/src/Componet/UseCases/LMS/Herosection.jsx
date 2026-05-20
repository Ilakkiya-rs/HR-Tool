'use client';

import { Button } from 'react-bootstrap';

import bgImg from '../../../assets/images/alterImages/7.png';

const Herosection = () => {
  const scrollToExperience = () => {
    const experienceSection = document.getElementById(
      'experience-plugin-section'
    );
    if (experienceSection) {
      const offset = 150;
      const scrollToPosition = experienceSection.offsetTop - offset;
      window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth'
      });
      const textInput = experienceSection.querySelector('input[type="text"]');
      if (textInput) {
        textInput.focus();
      }
    }
  };
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
              IYS Skills Profiler can immensely boost{' '}
              <span className="text-primary fw-regular">
                Learning Management Systems
              </span>{' '}
              value delivery
            </h1>
            <blockquote className="mt-5 mb-0 ps-3 border-start border-primary">
              <p className="lead mb-4 lh-lg">
                By enabling personal recommendations to users
              </p>
            </blockquote>
            <div className="mt-5">
              <Button
                variant="dark"
                type="submit"
                className="px-4 py-3 fs-5 mouse-cursor-gradient-tracking grad shadow"
                onClick={scrollToExperience}
              >
                Experience it now
              </Button>
            </div>
          </div>
        </div>
        {/* <!-- / .row --> */}
      </div>
      {/* <!-- / .container --> */}
    </section>
  );
};

export default Herosection;
