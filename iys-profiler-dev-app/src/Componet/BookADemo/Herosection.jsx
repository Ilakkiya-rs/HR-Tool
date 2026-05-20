'use client';
import { Button } from 'reactstrap';

import image from '../../assets/images/hero/consultancy.svg';

const HerosectionL4 = () => {
  // const scrollToExperience = () => {
  //   const experienceSection = document.getElementById(
  //     'experience-plugin-section'
  //   );
  //   if (experienceSection) {
  //     const offset = 150;
  //     const scrollToPosition = experienceSection.offsetTop - offset;
  //     window.scrollTo({
  //       top: scrollToPosition,
  //       behavior: 'smooth'
  //     });
  //     const textInput = experienceSection.querySelector('input[type="text"]');
  //     if (textInput) {
  //       textInput.focus();
  //     }
  //   }
  // };
  return (
    <>
      <section className="custom-py- positioscrollToExperiencen-relative hero-shape overflow-hidden hero-bg">
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
                To unleash Skills Profiler{' '}
                <span className="text-primary fw-regular">
                  Map, align, and thrive!
                </span>
              </h1>
              <div className="mt-5">
                <Button
                  variant="dark"
                  type="submit"
                  className="px-4 py-3 fs-5 btn-primary mouse-cursor-gradient-tracking grad shadow"
                >
                  Book a Demo
                </Button>
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
