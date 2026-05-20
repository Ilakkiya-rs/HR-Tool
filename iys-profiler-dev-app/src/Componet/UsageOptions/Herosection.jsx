'use client';

import Link from 'next/link';
import bgImg from '../../assets/images/alterImages/usecases.jpg';

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
              src={bgImg.src}
              className="img-fluid"
              alt="..."
            />
          </div>
          <div className="col-12 col-lg-7 col-xl-6">
            <h1 className="mb-4 font-w-4">
              IYS offers multiple options to{' '}
              <span className="text-primary fw-regular">
                {' '}
                HR Tech Developers and Others
              </span>{' '}
            </h1>
            <p className="lead mt-4 lh-lg">In case you missed it,</p>
            <Link href={'/experience-iys-skills-profiler'}>
              <button
                type="submit"
                className="px-4 py-3 fs-5 bg-primary shadow text-white rounded border-0"
              >
                Experience the Skills Profiler
              </button>
            </Link>
            <p className="lead mt-4 lh-lg">
              To use the IYS SKills Taxonomy and Profiler
            </p>
            <Link href="/contact">
              <button
                type="submit"
                className="px-4 py-3 fs-5 shadow rounded btn btn-primary"
              >
                Contact Us
              </button>
            </Link>
          </div>
        </div>
        {/* <!-- / .row --> */}
      </div>
      {/* <!-- / .container --> */}
    </section>
  );
};

export default Herosection;
