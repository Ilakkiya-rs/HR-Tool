'use client';

import Link from 'next/link';
import bgImg from '../../../assets/images/alterImages/5.png';

// import { Button } from 'reactstrap';

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
              className="img-fluid lighten-image"
              alt="..."
            />
          </div>
          <div className="col-12 col-lg-7 col-xl-6">
            <h1 className="mb-4 font-w-4">
              Map, Track, Manage Skills{' '}
              <span className="text-primary fw-regular">
                with the Organization Skills Management (OSM)
              </span>{' '}
              SaaS application
            </h1>
            <blockquote className="mt-5 mb-0 ps-3 border-start border-primary">
              <div className="mb-5">
                <p className="lead mb-0 lh-lg">
                  powered by built-in{' '}
                  <Link href="/skills-taxonomy-and-profiler">
                    Skills Taxonomy{' '}
                  </Link>
                  covering skills across industries, at zero additional cost
                </p>
              </div>
            </blockquote>
            <div className="mt-5">
              <Link href="/osm/demo">
                <button
                  type="submit"
                  className="px-3 py-2 fs-5 shadow rounded btn btn-primary bg-primary text-white"
                >
                  Book A Demo
                </button>
              </Link>
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
