'use client';

import { Button } from 'react-bootstrap';

import bgImg from '../../assets/images/alterImages/05.png';

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
              className="img-fluid lighten-image"
              alt="..."
            />
          </div>
          <div className="col-12 col-lg-7 col-xl-6">
            <h1 className="mb-4 font-w-4">
              IYS Skills Profiler{' '}
              <span className="text-primary fw-regular">Plugin</span>
            </h1>
            <blockquote className="mt-5 mb-0 ps-3 border-start border-primary">
              <div className="mb-5">
                <p className="lead mb-0 lh-lg">
                  The skills profiler plugin is a JS file with CSS. The CSS can
                  be modified as per your application needs.
                </p>
                <p className="lead mb-0 lh-lg">
                  The skills profiler plugin renders the skills based on skills
                  searched and selected by the users through API connected to
                  the IYS SKills and Occupations Taxonomy (ISOT).
                </p>
                <p className="lead mb-0 lh-lg">
                  ISOT is a rich large, intelligent organised, database of
                  skills across industries and functions.
                </p>
              </div>
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
