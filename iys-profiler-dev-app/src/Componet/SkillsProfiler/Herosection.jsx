'use client';

import { Button } from 'react-bootstrap';

import heroImg from '../../assets/images/alterImages/6.png';

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
              src={heroImg.src}
              className="img-fluid lighten-image"
              alt="..."
            />
          </div>
          <div className="col-12 col-lg-7 col-xl-6">
            <h1 className="mb-4 font-w-4">
              What is{' '}
              <span className="text-primary fw-regular">
                IYS Skills Profiler
              </span>
              ?
            </h1>
            <blockquote className="mt-5 mb-0 ps-3 border-start border-primary">
              <p className="lead mb-4 lh-lg">
                IYS Skills Profiler enables mapping of skills of people and of
                jobs in a comprehensive manner covering all aspects of talent
                including knowledge, tools, activities, domain knowledge and
                more. in a simple and intuitive manner
              </p>
              <p className="lead mb-4 lh-lg">
                IYS Skills Profiler is backed by a rich and most exhaustive
                skills taxonomy that is constantly updated..
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
