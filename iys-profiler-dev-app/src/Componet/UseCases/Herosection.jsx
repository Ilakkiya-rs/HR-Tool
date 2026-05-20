'use client';

import usecases from '../../assets/images/alterImages/completeSolution.png';

const Herosection = () => {
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
    <section className="custom-py- position-relative hero-shape overflow-hidden hero-bg">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-lg-5 col-xl-6 order-lg-2 mb-8 mb-lg-0">
            {/* <!-- Image --> */}
            <img
              style={{ width: '631px', height: 'auto' }}
              src={usecases.src}
              className="img-fluid"
              alt="..."
            />
          </div>
          <div className="col-12 col-lg-7 col-xl-6">
            <h1 className="mb-4 font-w-4">
              Use cases of{' '}
              <span className="text-primary fw-regular"> Skills Taxonomy</span>{' '}
            </h1>
            <blockquote className="mt-5 mb-0 ps-3 border-start border-primary">
              <p className="lead mb-4 lh-lg">
                IYS Skills Taxonomy helps in skill-enablement of recruitment,
                learning and development, career planning and development,
                workforce planning and more
              </p>
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
