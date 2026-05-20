'use client';

import image from '../../assets/images/alterImages/9.png';
import { sendGTMEvent } from '@next/third-parties/google';

const HerosectionL4 = () => {
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

  const handleClick = () => {
    sendGTMEvent({
      event: 'buttonClicked',
      value: 'Experience-Profiler-Button-Clicked'
    });
    scrollToExperience();
  };

  return (
    <>
      <section className="custom-py- position-relative hero-shape overflow-hidden hero-bg">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-5 col-xl-6 order-lg-2 mb-8 mb-lg-0">
              {/* <!-- Image --> */}
              <img
                src={image.src}
                className="img-fluid lighten-image"
                alt="..."
              />
            </div>
            <div className="col-12 col-lg-7 col-xl-6">
              <h1 className="mb-5 fw-light">
                IYS offers a rich{' '}
                <span className="text-primary fw-regular">
                  Skills Taxonomy and Profiler
                </span>
                <br />
                To enable{' '}
                <span className="text-primary fw-regular">
                  Skills based People Practices
                </span>{' '}
              </h1>
              {/* <blockquote className="mt-5 mb-0 ps-3 border-start border-primary">
                <p className="lead mb-0">
                  It’s like we offering car engine and You making the cars :)
                </p>
              </blockquote> */}
              <div className="mt-5">
                <button
                  type="submit"
                  className="px-4 py-3 fs-5 mouse-cursor-gradient-tracking grad shadow text-white rounded border-0"
                  onClick={handleClick}
                  id="experience-plugin-section-button"
                >
                  Experience the Skills Profiler
                </button>
              </div>
            </div>
          </div>
          {/* <!-- / .row --> */}
        </div>
        {/* <!-- / .container --> */}
      </section>
    </>
  );
};

export default HerosectionL4;
